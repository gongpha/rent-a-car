<script setup lang="ts">
import { onMounted } from 'vue';
import { ref, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiURL } from '@/envvars';
import { getFuel, getGear, getThaiDate, getInsuranceProperty } from '@/utils/texts';
import { type Branch } from './admin/AdminCars.vue'
import { type ReservationInfo, type CustomerInfo } from './PageReview.vue'
import axios from 'axios';

import ContentCenter from '@/components/ContentCenter.vue';

const router = useRouter()
const route = useRoute()

const showData = ref('')

onMounted(async () => {
	const rsvId = parseInt(route.params.rsvId as string)

	axios.get(apiURL + '/reservation/' + rsvId, {
		withCredentials: true,
		params: {
			email: route.query.email,
		}
	}).then((response) => {
		resv.value = response.data.resv
		cust.value = response.data.cust
		showData.value = 'success'

		reservationID.value = rsvId
	}).catch((error) => {
		console.error(error)
		showData.value = 'failed'
	})
});

const reservationID = ref<number>(0)
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
const cust : Ref<CustomerInfo> = ref({
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
})

</script>

<template>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<ContentCenter class="wide-limit" v-if="showData == 'success'">
		<h1>การจองของคุณ</h1>

		<CardContainer>
			<div>
				การจองของคุณ
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
									</div>{{ resv.startBranch.branch_name }} <br/> {{ getThaiDate(new Date(resv.startDate)) }}
								</div>
								<div class="car-property">
									<div class="car-property-iconframe-wide" v-tooltip="'จุดส่งคืน'">
										<i class="icon-car car-property-icon"/>
										<i class="icon-down car-property-icon"/>
									</div>{{ resv.endBranch.branch_name }} <br/> {{ getThaiDate(new Date(resv.endDate)) }}
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
		</CardContainer>
	</ContentCenter>
	<ContentCenter class="wide-limit" v-else-if="showData == 'failed'">
		<h1>ไม่พบการจอง</h1>
	</ContentCenter>

</template>