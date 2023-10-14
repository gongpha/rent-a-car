<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue'
import { useRouter, useRoute } from 'vue-router';
import { inject, onMounted, ref, type Ref } from 'vue';
import axios from 'axios';
import { apiURL } from '@/envvars';
import { getFuel, getGear, getThaiDate, getInsuranceProperty } from '@/utils/texts';
import { popup } from '@/utils/texts';

import { type Branch } from './admin/AdminCars.vue'
import { type Car } from './PageSearch.vue'
import { type Insurance } from './PageAddons.vue'
import type { VueCookies } from 'vue-cookies';

const route = useRoute()
const router = useRouter()

export interface CustomerInfo {
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
}

const cust = ref<CustomerInfo>({
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
})

const firstNameField = ref<HTMLElement | null>(null)
const lastNameField = ref<HTMLElement | null>(null)
const emailField = ref<HTMLElement | null>(null)
const telField = ref<HTMLElement | null>(null)

const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const accId = ref<number | undefined>(undefined)
const completed = ref(false)

const resultHeader = ref('')
const reservationID = ref<number>(0)
const resultSuccess = ref(false)

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
			hireDriver: route.query.hireDriver,
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
	if (!cust.value.firstName) {
		popup(firstNameField.value!, "กรุณากรอกชื่อ")
		return
	}
	if (!cust.value.lastName) {
		popup(lastNameField.value!, "กรุณากรอกนามสกุล")
		return
	}
	if (!cust.value.email) {
		popup(emailField.value!, "กรุณากรอกอีเมล")
		return
	}
	if (!emailCheck.test(cust.value.email)) {
		popup(emailField.value!, "กรุณากรอกอีเมลให้ถูกต้อง")
		return
	}

	if (!cust.value.phone) {
		popup(telField.value!, "กรุณากรอกหมายเลขโทรศัพท์")
		return
	}

	//

	axios.post(apiURL + '/reserve', {
		branchStartID: route.query.branchStartID,
		branchEndID: route.query.branchEndID,
		startDate: route.query.startDate,
		endDate: route.query.endDate,

		carId: route.query.carId,

		insuranceId: route.query.insuranceId,
		hireDriver: route.query.hireDriver,

		accId: accId.value,

		firstName: cust.value.firstName,
		lastName: cust.value.lastName,
		email: cust.value.email,
		phone: cust.value.phone,
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
}

</script>

<template>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<div class="checkout" v-if="!completed">
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
			<h1>ข้อมูลผู้ขับ</h1>
			<CardContainer class="car-card cardside" v-if="resv">
				<div class="form-card-body">
					<div class="form-input-text">
						<span class="form-label">ชื่อ</span>
						<input type="text" v-model="cust.firstName" ref="firstNameField" />
					</div>
					<div class="form-input-text">
						<span class="form-label">นามสกุล</span>
						<input type="text" v-model="cust.lastName" ref="lastNameField" />
					</div>
					<div class="form-input-text">
						<span class="form-label">อีเมล</span>
						<input type="email" v-model="cust.email" ref="emailField" />
					</div>
					<div class="form-input-text">
						<span class="form-label">หมายเลขโทรศัพท์</span>
						<input type="tel" v-model="cust.phone" ref="telField" />
					</div>
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