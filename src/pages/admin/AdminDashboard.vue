<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { apiURL } from '../../envvars';
import { ref, onMounted, computed } from 'vue';
import { type Branch } from './AdminCars.vue'

import { Bar } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export interface Reservation {
	id : number;
	c_first_name : string;
	c_last_name : string;
	car_image : string;
	car_plate : string;
	car_mileage : number;
	car_id : number;
	model_id : number;
	model_brand : string;
	model_model : string;
	model_year : number;
	start : Date;
	end : Date;
	status : 'CAR' | 'COMPLETED' | 'CANCELED';
}

const reservations = ref<Reservation[]>([])
const searchText = ref('')
const isRoot = ref(false)
const rootBranchId = ref(0)
const rootBranches = ref<{
					[key: string]: Branch;
				}>({
	0: {
		branch_id: 0,
		location: '',
		branch_name: 'เลือกสาขา'
	}
})

onMounted(() => {
	axios.get(apiURL + '/admin/reservations/0/today', {
		withCredentials: true
	}).then((response) => {
		
		if (response.data.root) {
			// root
			isRoot.value = true
			
			axios.get(apiURL + '/branches').then((response) => {
				for (const branch of response.data.branches) {
					rootBranches.value[branch.branch_id] = branch
				}

				rootBranchId.value = response.data[0].branch_id
			}).catch((error) => {
				console.error(error)
			})
			return;
		}
		reservations.value = response.data.reservations
	}).catch((error) => {
		console.error(error)
	})
	stats()
});

const filteredReservations = computed(() => {
	return reservations.value.filter((rsv) => {
		const lower = searchText.value.toLowerCase();
		return (
			rsv.id.toString().includes(lower) ||
			(rsv.c_first_name + " " + rsv.c_last_name).toLowerCase().includes(lower) ||
			(rsv.car_plate + " " + rsv.model_brand + " " + rsv.model_model).toLowerCase().includes(lower)
		)
	})
})

const onBranchChange = (event: Event) => {
	const target = event.target as HTMLSelectElement
	const branchId = parseInt(target.value)
	if (branchId == 0) {
		return
	}
	axios.get(apiURL + '/admin/reservations/' + branchId + '/today', {
		withCredentials: true
	}).then((response) => {
		reservations.value = response.data.reservations
	}).catch((error) => {
		console.error(error)
	})
}

const monthly = ref<any>({
	labels: [],
	datasets: []
})
const weekly = ref<any>({
	labels: [],
	datasets: []
})

function stats() {
	axios.get(apiURL + '/stats/monthly', {
		withCredentials: true
	}).then((response) => {
		monthly.value = {
			labels: response.data.labels,
			datasets: [ { data: response.data.data } ]
		}
	}).catch((error) => {
		console.error(error)
	})
	axios.get(apiURL + '/stats/weekly', {
		withCredentials: true
	}).then((response) => {
		weekly.value = {
			labels: response.data.labels,
			datasets: [ { data: response.data.data } ]
		}
	}).catch((error) => {
		console.error(error)
	})
}

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1>ยอดการจอง</h1>
		<div class="graph2">
			<div class="graph2e">
				<h2>ยอดจองต่อเดือน</h2>
				<Bar
					id="my-chart-id"
					:width="50" :height="50"
							:data="monthly"
				/>
			</div>
			<div class="graph2e">
				<h2>ยอดจองต่อสัปดาห์</h2>
				<Bar
					id="my-chart-id"
					:width="50" :height="50"
							:data="weekly"
				/>
			</div>
		</div>
		<h1>การจองที่จะมีวันนี้</h1>
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<tr v-if="isRoot">
				<th colspan="7">
					<select v-model="rootBranchId" @change="onBranchChange($event)">
						<option :key="branch.branch_id" v-for="branch in rootBranches" :value="branch.branch_id">
							{{ branch.branch_name }}
						</option>
					</select>
				</th>
			</tr>
			<tr>
				<th colspan="7">
					<input type="text" placeholder="ค้นหา" v-model="searchText" />
				</th>

			</tr>
			<tr>
				<th>รูป</th>
				<th>หมายเลข</th>
				<th>ทะเบียน</th>
				<th>ยี่ห้อ/รุ่น/ปี</th>
				<th>ชื่อลูกค้า</th>
				<th>เริ่ม-สิ้นสุด</th>
			</tr>
			<tr :key="rsv.id" v-for="rsv in filteredReservations">
				<td>
					<img :src="rsv.car_image" width="100" height="100" />
				</td>
				<td>
					<router-link class="admin-table-not-empty" :to="'/adminpanel/reservation/' + rsv.id">
						{{ rsv.id }}
					</router-link>
				</td>
				<td>{{ rsv.car_plate }}</td>
				<td>{{ rsv.model_brand }} {{ rsv.model_model }} {{ rsv.model_year }}</td>
				<td>{{ rsv.c_first_name }} {{ rsv.c_last_name }}</td>
				<td>{{ rsv.start }} - {{ rsv.end }}</td>
			</tr>
		</table>
	</div>
</template>