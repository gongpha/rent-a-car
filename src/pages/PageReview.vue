<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue'
import { useRouter, useRoute } from 'vue-router';
import { inject, onMounted, ref, watch, type Ref, computed } from 'vue';
import axios from 'axios';
import { apiURL } from '@/envvars';
import { getFuel, getGear, getThaiDate, getInsuranceProperty } from '@/utils/texts';
import { popup } from '@/utils/texts';
import VueMultiselect from 'vue-multiselect'
import LoginPanel from '@/components/LoginPanel.vue';

import 'vue-loading-overlay/dist/css/index.css';


import { type Branch } from './admin/AdminCars.vue'
import { type Car } from './PageSearch.vue'
import { type Insurance } from './PageAddons.vue'
import type { VueCookies } from 'vue-cookies';

import InputRequired from '@/components/InputRequired.vue';

const route = useRoute()
const router = useRouter()

export interface CustomerInfo {
	picture: string,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
}

const cust = ref<CustomerInfo>({
	picture: '',
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
})

const cardholderField = ref<HTMLElement | null>(null)
const cardNumberField = ref<HTMLElement | null>(null)
const expiryField = ref<HTMLElement | null>(null)
const cvcField = ref<HTMLElement | null>(null)
const bankField = ref<HTMLElement | null>(null)
const countryField = ref<HTMLElement | null>(null)

//const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const accId = ref<number | undefined>(undefined)
const completed = ref(false)

const resultHeader = ref('')
const reservationID = ref<number>(0)
const resultSuccess = ref(false)

import countries from '../data/countries.json'

export interface ReservationInfo {
	startBranch: Branch,
	endBranch: Branch,
	startDate: Date,
	endDate: Date,
	car: Car,

	insurance: Insurance | null,

	// calculated
	costs: {name : string, value : number}[],
	summary: {length : number},
	total: number,
}

const resv : Ref<ReservationInfo> = ref({
	startBranch: {
		branch_id: 0,
		branch_name: '',
		location: '',
	},
	endBranch: {
		branch_id: 0,
		branch_name: '',
		location: '',
	},
	startDate: new Date(),
	endDate: new Date(),
	car: {
		brand: '',
		car_id: 0,
		car_image: '',
		car_type: '',
		fuel_type: '',
		model: '',
		price_per_day: 0,
		seats: 0,
		year: '',
		gear: '',
	},
	insurance: null,
	costs: [],
	summary: {
		length: 0,
	},
	total: 0,
})

onMounted(() => {
	const sum = axios.get(apiURL + '/reserve/summary', {
		params : {
			branchStartID: route.query.branchStartID,
			branchEndID: route.query.branchEndID,
			startDate: route.query.startDate,
			endDate: route.query.endDate,

			carId: route.query.carId,

			insuranceId: route.query.insuranceId,
		}
	})

	const queries : Promise<any>[] = [
		sum,
		axios.get(apiURL + '/branch/' + route.query.branchStartID),
		axios.get(apiURL + '/branch/' + route.query.branchEndID),
		axios.get(apiURL + '/car/' + route.query.carId),
	]

	if (route.query.insuranceId)
		queries.push(axios.get(apiURL + '/insurance/' + route.query.insuranceId))

	Promise.all(queries).then((values) => {
		axios.get(apiURL + '/profile/button', { withCredentials: true }).then((res) => {
			accId.value = res.data.acc_id
			cust.value.picture = res.data.picture
			cust.value.firstName = res.data.first_name
			cust.value.lastName = res.data.last_name
			cust.value.email = res.data.email
			cust.value.phone = res.data.phone
		})

		resv.value = {
			startBranch : values[1].data,
			endBranch : values[2].data,
			startDate : new Date(route.query.startDate as string),
			endDate : new Date(route.query.endDate as string),
			
			car : values[3].data,
			insurance : values.length > 4 ? values[4].data : null,

			costs : values[0].data.costs,
			summary : values[0].data.summary,
			total : values[0].data.total,
		}
	});
})
const $cookies = inject<VueCookies>('$cookies')
function submit() {
	if (!cardholder.value) {
		popup(cardholderField.value!, "กรุณากรอกชื่อบนบัตร")
		return
	}
	if (!cardNumber.value) {
		popup(cardNumberField.value!, "กรุณากรอกหมายเลขบัตร")
		return
	}
	if (validateCardNumber(cardNumber.value) === false) {
		popup(cardNumberField.value!, "หมายเลขบัตรไม่ถูกต้อง")
		return
	}
	if (cardExpiryMonth.value === undefined) {
		popup(expiryField.value!, "กรุณาเลือกเดือนหมดอายุบัตร")
		return
	}
	if (cardExpiryYear.value === undefined) {
		popup(expiryField.value!, "กรุณาเลือกปีหมดอายุบัตร")
		return
	}
	if (!cardCvc.value) {
		popup(cvcField.value!, "กรุณากรอก CVC")
		return
	}
	if (!cardFromBank.value) {
		popup(bankField.value!, "กรุณากรอกธนาคารผู้ออกบัตร")
		return
	}
	if (!cardCountry.value) {
		popup(countryField.value!, "กรุณาเลือกประเทศผู้ออกบัตร")
		return
	}

	const loader = $loading.show({
            // Optional parameters
        });
        setTimeout(() => {
			loader.hide()
			axios.post(apiURL + '/reserve', {
				branchStartID: route.query.branchStartID,
				branchEndID: route.query.branchEndID,
				startDate: route.query.startDate,
				endDate: route.query.endDate,

				carId: route.query.carId,

				insuranceId: route.query.insuranceId,

				accId: accId.value,

				firstName: cust.value.firstName,
				lastName: cust.value.lastName,
				email: cust.value.email,
				phone: cust.value.phone,

				/* */

				cardholder: cardholder.value,
				cardNumber: cardNumber.value,
				cardExpiryMonth: cardExpiryMonth.value!.value,
				cardExpiryYear: cardExpiryYear.value!.value,
				cardCvc: cardCvc.value,
				cardFromBank: cardFromBank.value,
				cardCountry: cardCountry.value.alpha3,

				storeMyPaymentInfo: storeMyPaymentInfo.value,
			}, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
				},
			}).then((res) => {
				reservationID.value = res.data.reservation_id
				resultHeader.value = 'จองสำเร็จ'
				completed.value = true
				resultSuccess.value = true
			}).catch((err) => {
				resultHeader.value = 'จองล้มเหลว'
				console.log(err)
				completed.value = true
			})
        }, 2000)
	return
}

//

const cardholder = ref<string>('')
const cardNumber = ref<string>('')

const cards = [
	{
		type: 'visa-electron',
		pattern: /^4(026|17500|405|508|844|91[37])/,
		format: null,
		length: [16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Visa-Electron.svg"
	},
	{
		type: 'maestro',
		pattern: /^(5(018|0[23]|[68])|6(39|7))/,
		format: null,
		length: [12, 13, 14, 15, 16, 17, 18, 19],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Maestro.svg"
	},
	{
		type: 'dankort',
		pattern: /^5019/,
		format: null,
		length: [16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Dankort_logo.png"
	},
	{
		type: 'visa',
		pattern: /^4/,
		format: null,
		length: [13, 16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Visa_Inc._logo.svg"
	},
	{
		type: 'mastercard',
		pattern: /^(5[1-5]|2[2-7])/,
		format: null,
		length: [16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Mastercard-logo.svg"
	},
	{
		type: 'amex',
		pattern: /^3[47]/,
		format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
		length: [15],
		cvcLength: [3, 4],
		luhn: true,
		image: "/src/assets/banks/American_Express_logo_(2018).svg"
	},
	{
		type: 'dinersclub',
		pattern: /^3[0689]/,
		format: /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,2})?/,
		length: [14],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Diners_Club_Logo3.svg"
	},
	{
		type: 'discover',
		pattern: /^6([045]|22)/,
		format: null,
		length: [16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/Discover_Card_logo.svg"
	},
	{
		type: 'chinaunionpay',
		pattern: /^(62|88)/,
		format: null,
		length: [16, 17, 18, 19],
		cvcLength: [3],
		luhn: false,
		image: "/src/assets/banks/UnionPay_logo.svg"
	},
	{
		type: 'jcb',
		pattern: /^35/,
		format: null,
		length: [16],
		cvcLength: [3],
		luhn: true,
		image: "/src/assets/banks/JCB_logo.svg"
	}
]

interface Card {
	type: string,
	pattern: RegExp,
	format: RegExp | null,
	length: number[],
	cvcLength: number[],
	luhn: boolean,
	image: string
}

function luhnCheck(num : string) {
	var digit, digits, j, len, odd, sum
	odd = true
	sum = 0
	digits = (num + '').split('').reverse()
	for (j = 0, len = digits.length; j < len; j++) {
		digit = digits[j]
		digit = parseInt(digit, 10)
		if ((odd = !odd)) {
			digit *= 2
		}
		if (digit > 9) {
			digit -= 9
		}
		sum += digit
	}
	return sum % 10 === 0
}

function validateCardNumber(num : string) : boolean {
	var card
	num = (num + '').replace(/\s+|-/g, '')
	if (!/^\d+$/.test(num)) {
		return false
	}
	card = cardFromNumber(num)
	if (!card) {
		return false
	}
	return card.length.includes(num.length) && (card.luhn === false || luhnCheck(num))
}

function cardFromNumber(num : string) : Card | undefined {
	num = (num + '').replace(/\D/g, '')
	for (let j = 0, len = cards.length; j < len; j++) {
		let card = cards[j]
		if (card.pattern.test(num)) {
			return card
		}
	}
}

const defaultFormat = /(\d{1,4})/g

function formatCardNumber(num : string) : string | undefined {
	var groups, refc, upperLength

	num = num.replace(/\D/g, '')
	const card = cardFromNumber(num)
	if (!card) {
		return num
	}

	if (!card.format) {
		card.format = defaultFormat
	}

	upperLength = card.length[card.length.length - 1]
	num = num.slice(0, upperLength)
	if (card.format.global) {
		return (refc = num.match(card.format)) != null ? refc.join(' ') : undefined
	} else {
		groups = card.format.exec(num)
		if (groups == null) {
			return undefined
		}
		groups.shift()
		groups = groups.filter(Boolean)
		return groups.join(' ')
	}
}

watch(cardNumber, (val : string) => {
	cardNumber.value = formatCardNumber(val) ?? ''
})

const card = computed(() => {
	if (!cardNumber.value) {
		return { type: false, pattern: {}, format: {}, length: [], cvcLength: [], luhn: false, image: '' }
	}
	return cardFromNumber(cardNumber.value)
})

const ccIcon = computed(() => {
	return card.value?.image
})

const cardExpiryMonth = ref<{name: string, value: number} | undefined>(undefined)
const cardExpiryYear = ref<{name: string, value: number} | undefined>(undefined)
const cardCvc = ref('')

const storeMyPaymentInfo = ref(false)

const expMonths = [
	{ name: '01', value: 1 },
	{ name: '02', value: 2 },
	{ name: '03', value: 3 },
	{ name: '04', value: 4 },
	{ name: '05', value: 5 },
	{ name: '06', value: 6 },
	{ name: '07', value: 7 },
	{ name: '08', value: 8 },
	{ name: '09', value: 9 },
	{ name: '10', value: 10 },
	{ name: '11', value: 11 },
	{ name: '12', value: 12 },
]

const expYears = [
	{ name: '2021', value: 2021 },
	{ name: '2022', value: 2022 },
	{ name: '2023', value: 2023 },
	{ name: '2024', value: 2024 },
	{ name: '2025', value: 2025 },
	{ name: '2026', value: 2026 },
	{ name: '2027', value: 2027 },
	{ name: '2028', value: 2028 },
	{ name: '2029', value: 2029 },
	{ name: '2030', value: 2030 },
	{ name: '2031', value: 2031 },
	{ name: '2032', value: 2032 },
]

const cardFromBank = ref('')
const cardCountry = ref<{alpha3: string}>({alpha3: ''}) // alpha3

import {useLoading} from 'vue-loading-overlay'
    
const $loading = useLoading({
	// options
});

</script>

<template>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<div v-if="accId === undefined">
		<ContentCenter class="wide-limit">
			<CardContainer class="car-card cardside" v-if="resv">
				<div style="margin-left: auto; margin-right: auto;">
					<LoginPanel desc="กรุณาเข้าสู่ระบบก่อนทำการจอง" :dontgohome="true"/>
				</div>
			</CardContainer>
		</ContentCenter>
	</div>
	<div class="checkout" v-else-if="!completed">
		<ContentCenter class="wide-limit">
			<h1>สรุปยอดการจอง</h1>
			<CardContainer class="car-card cardside" v-if="resv">
				<div class="summary-content">
					<div class="summary-content-left">
						<img :src="resv.car.car_image" class="card-img-thumb-small" />
						<h4>{{ resv.car.brand }} {{ resv.car.model }} {{ resv.car.year }}</h4>
						รับที่
						<h5>{{ resv.startBranch.branch_name }}</h5><br/>
						<h5>{{ getThaiDate(resv.startDate) }}</h5>
						ส่งคืนที่
						<h5>{{ resv.endBranch.branch_name }}</h5>
						<h5>{{ getThaiDate(resv.endDate) }}</h5>
						ระยะเวลา
						<h5>{{ resv.summary.length }} วัน</h5>
					</div>
					<div class="summary-content-right">
						<span class="cost-item" v-for="cost in resv.costs" v-bind:key="cost.name">
							<span>{{ cost.name }}</span>
							<span class="cost-amount">฿ {{ cost.value.toLocaleString() }}</span>
						</span>
						<hr>
						<span class="cost-item">
							<span>รวม</span>
							<span class="cost-amount">฿ {{ resv.total.toLocaleString() }}</span>
						</span>
					</div>
				</div>
			</CardContainer>
			<!--h1>ข้อมูลส่วนตัว</h1>
			<CardContainer class="car-card cardside" v-if="resv">
				<div style="margin-left: auto; margin-right: auto;">
					<div class="profilebutton-info-header">
						<img class="pfp-big" :src="cust.picture" alt="profile picture">
						<h1>{{ cust.firstName }} {{ cust.lastName }}</h1>
					</div>
				</div>
			</CardContainer-->
			<h1>ข้อมูลการชำระเงิน</h1>
			<CardContainer class="car-card cardside" v-if="resv">
				<div class="form-card-body">
					<div class="form-input-text">
						<span class="form-label">ชื่อบนบัตร<InputRequired/></span>
						<input type="text" v-model="cardholder" ref="cardholderField" />
					</div>
					<div class="form-input-text">
						<span class="form-label">เลขบัตร<InputRequired/></span>
						<input type="text" v-model="cardNumber" ref="cardNumberField" />
						<img v-if="ccIcon" :src="ccIcon" style="width: 32px; margin-left: 16px;" />
					</div>
					

					<div class="form-input-text" style="display: flex;" ref="expiryField" >
						<span class="form-label">วันหมดอายุบัตร<InputRequired/></span>
						<span style="display:flex;width: 300px;">
							<VueMultiselect
								label="name"
								placeholder="เดือนหมดอายุ"
								:options="expMonths"
								style="width: 300px;"
								:show-labels="false"
								v-model="cardExpiryMonth"
							></VueMultiselect>

							<VueMultiselect
								label="name"
								placeholder="ปีหมดอายุ"
								:options="expYears"
								style="width: 300px;"
								:show-labels="false"
								v-model="cardExpiryYear"
							></VueMultiselect>
						</span>
					</div>

					<div class="form-input-text">
						<span class="form-label">CVC<InputRequired/></span>
						<input type="text" v-model="cardCvc" ref="cvcField" maxlength="4" />
					</div>

					<div class="form-input-text">
						<span class="form-label">ธนาคารผู้ออกบัตร<InputRequired/></span>
						<input type="email" v-model="cardFromBank" ref="bankField" />
					</div>

					<div class="form-input-text" style="display: flex;" ref="countryField">
						<span class="form-label">ประเทศผู้ออกบัตร<InputRequired/></span>
						<span style="display:flex;width: 300px;">
							<VueMultiselect
								label="name"
								placeholder="เลือกประเทศ"
								:options="countries"
								:show-labels="false"
								v-model="cardCountry"
							></VueMultiselect>
						</span>
					</div>
					<label style="margin-right: auto; margin-top: auto; margin-bottom: auto;">
						<input
						type="checkbox"
						v-model="storeMyPaymentInfo"
						>
						บันทึกข้อมูลการจ่ายเงินสำหรับการจ่ายเงินครั้งต่อไป
					</label>
					<button class="button" @click="submit">
						ยืนยันข้อมูล
					</button>
				</div>
			</CardContainer>
		</ContentCenter>
	</div>
	<div v-else>
		<ContentCenter class="wide-limit">
			<h1>{{ resultHeader }}</h1>

			<CardContainer>
				<div v-if="resultSuccess">
					การจองของคุณได้รับการยืนยันแล้ว
					<div id="reservation-info">
						<h3>หมายเลข #{{ reservationID }}</h3>
						<br/>
						<img :src="resv.car.car_image" class="card-img-thumb-small">
						<div class="cardside-content-wide">
							<h3 class="force-black">{{ resv.car.brand }} {{ resv.car.model }} {{ resv.car.year }}</h3>
							<div class="cardside-content-info">
								<div class="car-property-row">
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ชนิดรถ'">
											<i class="icon-car car-property-icon"/>
										</div>
										{{ resv.car.car_type }}
									</div>
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'จำนวนที่นั่ง'">
											<i class="icon-seat car-property-icon"/>
										</div>
										{{ resv.car.seats }} ที่นั่ง
									</div>
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ระบบเชื้อเพลิง'">
											<i class="icon-fuel car-property-icon"/>
										</div>{{ getFuel(resv.car.fuel_type) }}
									</div>
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ระบบเกียร์'">
											<i class="icon-gear car-property-icon"/>
										</div>{{ getGear(resv.car.gear) }}
									</div>
								</div>
								<div class="car-property-row">
									<div class="car-property">
										<div class="car-property-iconframe-wide" v-tooltip="'จุดรับ'">
											<i class="icon-car car-property-icon"/>
											<i class="icon-up car-property-icon"/>
										</div>{{ resv.startBranch.branch_name }} <br/> {{ getThaiDate(resv.startDate) }}
									</div>
									<div class="car-property">
										<div class="car-property-iconframe-wide" v-tooltip="'จุดส่งคืน'">
											<i class="icon-car car-property-icon"/>
											<i class="icon-down car-property-icon"/>
										</div>{{ resv.endBranch.branch_name }} <br/> {{ getThaiDate(resv.endDate) }}
									</div>
								</div>
							</div>
							
						</div>
						<br/>
						<table>
							<tr>
								<td>ชื่อ</td>
								<td>{{ cust.firstName }}</td>
							</tr>
							<tr>
								<td>นามสกุล</td>
								<td>{{ cust.lastName }}</td>
							</tr>
							<tr>
								<td>อีเมล</td>
								<td>{{ cust.email }}</td>
							</tr>
							<tr>
								<td>เบอร์โทรศัพท์</td>
								<td>{{ cust.phone }}</td>
							</tr>
						</table>
					</div>
				</div>
				<p v-else>
					การจองของคุณไม่สำเร็จ อาจจะเกิดจากเหตุผลต่อไปนี้
					<ul>
						<li>คุณกรอกข้อมูลไม่ครบถ้วน</li>
						<li>คุณกรอกข้อมูลไม่ถูกต้อง</li>
						<li>คุณกรอกข้อมูลซ้ำกับข้อมูลที่มีอยู่ในระบบ</li>
						<li>มีการจองซ้อนกันเกิดขึ้นในระหว่างที่คุณจะทำการจอง</li>
						<li>การจองได้เสร็จสิ้นไปแล้ว แต่คุณได้กลับมาทีหน้านี้</li>
					</ul>
					กลับไปที่ <a class="a-link" href="/">หน้าแรก</a> เพื่อทำการจองใหม่
				</p>
			</CardContainer>
		</ContentCenter>
	</div>
</template>