<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue'
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { apiURL } from '@/envvars';
import { useRouter, useRoute } from 'vue-router';
import { getFuel, getGear, getThaiDate, getInsuranceProperty } from '@/utils/texts';
import { type Branch } from './admin/AdminCars.vue'
import PriceLabel from '@/components/PriceLabel.vue';

import { type Car } from './PageSearch.vue'

const route = useRoute()
const router = useRouter()

export interface Insurance {
	insurance_id : number,
	name : string
	properties : {
		bodily_injury : boolean
		vehicle_damage : boolean
		property_damage : boolean
		thief_fire : boolean
	}

	description : string
	cost_per_day : number

	//
	added: boolean
}

const car = ref<Car>({
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
})

const startBranch = ref<Branch>({
	branch_id: 0,
	branch_name: '',
	location: '',
})

const endBranch = ref<Branch>({
	branch_id: 0,
	branch_name: '',
	location: '',
})

router.isReady().then(() => {
	startDate.value = new Date(route.query.startDate as string)
	endDate.value = new Date(route.query.endDate as string)
})

const startDate = ref(new Date());
const endDate = ref(new Date());

const insurances = ref<Insurance[]>([])
const selectedInsurance = ref<Insurance|null>(null)

const hireDriver = ref<boolean>(false)

function review() {
	const query = {
		branchStartID: route.query.branchStartID,
		branchEndID: route.query.branchEndID,
		startDate: (route.query.startDate instanceof Date) ? route.query.startDate.toISOString() : route.query.startDate,
		endDate: (route.query.endDate instanceof Date) ? route.query.endDate.toISOString() : route.query.endDate,

		carId: route.query.carId,

		insuranceId: selectedInsurance.value?.insurance_id,
		hireDriver: hireDriver.value? 1 : 0,
	}

	router.push({
		path: '/review',
		query: query
	})
}

onMounted(() => {
	axios.get(apiURL + '/car/' + route.query.carId)
		.then((res) => {
			car.value = res.data
		})
		.catch((err) => {
			console.log(err)
		})
	axios.get(apiURL + '/branch/' + route.query.branchStartID)
		.then((res) => {
			startBranch.value = res.data
		})
		.catch((err) => {
			console.log(err)
		})
	axios.get(apiURL + '/branch/' + route.query.branchEndID)
		.then((res) => {
			endBranch.value = res.data
		})
		.catch((err) => {
			console.log(err)
		})
		axios.get(apiURL + '/insurances')
		.then((res) => {
			insurances.value = res.data.insurances
			for (let i = 0; i < insurances.value.length; i++) { // trad ??
				insurances.value[i].added = false
			}
		})
		.catch((err) => {
			console.log(err)
		})
})

function addInsu(insurance: Insurance) {
	selectedInsurance.value = insurance
}

function removeInsu(insurance_: Insurance) {
	selectedInsurance.value = null
}

function addDriver() {
	hireDriver.value = true
}

function removeDriver() {
	hireDriver.value = false
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<div class="searchcar-pin">
		<CardContainer v-bind:class="'float-mini'">
			<img :src="car.car_image" class="card-img-thumb-small">
			<div class="cardside-content-wide">
				<h3 class="force-black">{{ car.brand }} {{ car.model }} {{ car.year }}</h3>
				<div class="cardside-content-info">
					<div class="car-property-row">
						<div class="car-property">
							<div class="car-property-iconframe" v-tooltip="'ชนิดรถ'">
								<i class="icon-car car-property-icon"/>
							</div>
							{{ car.car_type }}
						</div>
						<div class="car-property">
							<div class="car-property-iconframe" v-tooltip="'จำนวนที่นั่ง'">
								<i class="icon-seat car-property-icon"/>
							</div>
							{{ car.seats }} ที่นั่ง
						</div>
						<div class="car-property">
							<div class="car-property-iconframe" v-tooltip="'ระบบเชื้อเพลิง'">
								<i class="icon-fuel car-property-icon"/>
							</div>{{ getFuel(car.fuel_type) }}
						</div>
						<div class="car-property">
							<div class="car-property-iconframe" v-tooltip="'ระบบเกียร์'">
								<i class="icon-gear car-property-icon"/>
							</div>{{ getGear(car.gear) }}
						</div>
					</div>
					<div class="car-property-row">
						<div class="car-property">
							<div class="car-property-iconframe-wide" v-tooltip="'จุดรับ'">
								<i class="icon-car car-property-icon"/>
								<i class="icon-up car-property-icon"/>
							</div>{{ startBranch.branch_name }} <br/> {{ getThaiDate(startDate) }}
						</div>
						<div class="car-property">
							<div class="car-property-iconframe-wide" v-tooltip="'จุดส่งคืน'">
								<i class="icon-car car-property-icon"/>
								<i class="icon-down car-property-icon"/>
							</div>{{ endBranch.branch_name }} <br/> {{ getThaiDate(endDate) }}
						</div>
					</div>
					<div class="car-property-row">
						<div v-if="hireDriver" class="car-property">
							<div class="car-property-iconframe">
								<i class="icon-driver car-property-icon"/>
							</div>เช่าพร้อมคนขับ
						</div>
						<div v-if="selectedInsurance" class="car-property">
							<div class="car-property-iconframe" v-tooltip="'ประกันภัย'">
								<i class="icon-insurance car-property-icon"/>
							</div>{{ selectedInsurance.name }}
						</div>
					</div>
					<div class="cost-item">
						<span>&nbsp;</span>
						<button class="button" @click="review">สรุปข้อมูลการจอง</button>
					</div>
				</div>
				
			</div>
		</CardContainer>
	</div>
	<div class="checkout">
		<ContentCenter class="wide-limit">
			<div class="two-col">
				<!--CardContainer class="tc-left">
					fuckoff
				</CardContainer-->
				<div class="tc-right car-list">
					<h1>คนขับ</h1>
					<CardContainer class="car-card cardside">
						<div class="insurance-card-body">
							<div style="display: flex;">
								<div>
									<p>
										สะดวกสบาย ไม่ต้องเสียเวลาเรียกหรือโบกรถหลายรอบ ด้วยรถยนต์พร้อมคนขับ
										ที่พร้อมให้บริการคุณตลอดการเดินทางตามระยะเวลาที่คุณต้องการ - แวะกี่ที่ก็ได้ ไม่มีจำกัด
									</p>
									<div class="cardside-content-info">
										<div class="car-property-row">
											<div class="car-property">
												<div class="car-property-iconframe">
													<i class="icon-car car-property-icon"/>
												</div>
												มั่นใจในความคุ้มค่า ไปกี่ที่ก็ได้
											</div>
											<div class="car-property">
												<div class="car-property-iconframe">
													<i class="icon-timelapsed car-property-icon"/>
												</div>
												ตอบทุกการใช้งานด้วยแพ็คเกจเวลา
											</div>
										</div>
										<div class="car-property-row">
											<div class="car-property">
												<div class="car-property-iconframe">
													<i class="icon-pessengers car-property-icon"/>
												</div>
												ไม่ต้องขับเอง ไม่ต้องเหนื่อย
											</div>
											<div class="car-property">
												<div class="car-property-iconframe">
													<i class="icon-pricecheck car-property-icon"/>
												</div>
												ให้บริการด้วยราคามาตรฐาน
											</div>
										</div>
									</div>
								</div>
								<img src="https://cdn.discordapp.com/attachments/359611399774797824/1162440844834525184/driver.png?ex=653bf266&is=65297d66&hm=2a8d7a4a5af98805147fcb476938690351690b1523913e49663949e1033f7204&"
								
								/>
							</div>
							<button v-if="!hireDriver" class="button" @click="addDriver()">เลือก</button>
							<button v-else class="button negative" @click="removeDriver()">เลิกเลือก</button>
						</div>
					</CardContainer>
					<h1>ประกันภัย</h1>
					<CardContainer class="car-card cardside" v-for="insurance in insurances" v-bind:key="insurance.insurance_id">
						<div class="insurance-card-body">
							<h3>{{ insurance.name }}</h3>
							<p>
								{{ insurance.description }}
							</p>
							<div v-for="prop in Object.entries(insurance.properties)" v-bind:key="prop[0]" class="cardside-content-info">
								<div class="car-property" v-if="prop[1]">
									<div class="car-property-iconframe">
										<i class="icon-true car-property-icon"/>
									</div>
									{{ getInsuranceProperty(prop[0]) }}
								</div>
							</div>
							<PriceLabel suffix=" / วัน">{{ insurance.cost_per_day }}</PriceLabel>
							<button v-if="selectedInsurance !== insurance" class="button" @click="addInsu(insurance)">เลือก</button>
							<button v-else class="button negative" @click="removeInsu(insurance)">เลิกเลือก</button>
						</div>
					</CardContainer>
				</div>
			</div>
		</ContentCenter>
	</div>
</template>