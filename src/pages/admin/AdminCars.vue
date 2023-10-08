<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { apiURL } from '../../envvars';
import { ref, onMounted, computed } from 'vue';
import type { Car } from './AdminCar.vue'

export interface Branch {
	branch_name: string,
	location: string,
	branch_id: number,
}

const cars = ref<Car[]>([])
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
	axios.get(apiURL + '/admin/cars', {
		withCredentials: true
	}).then((response) => {
		if (response.data.length == 0) {
			// root ? owo
			isRoot.value = true
			
			axios.get(apiURL + '/branches').then((response) => {
				for (const branch of response.data.branches) {
					rootBranches.value[branch.branch_id] = branch
				}

				rootBranchId.value = response.data[0].branch_id
			}).catch((error) => {
				console.error(error)
			})

		}
		cars.value = response.data
	}).catch((error) => {
		console.error(error)
	})
});

const filteredCars = computed(() => {
	return cars.value.filter((car) => {
		const lower = searchText.value.toLowerCase();
		return car.license_plate.toLowerCase().includes(lower) ||
			car.brand.toLowerCase().includes(lower) ||
			car.model.toLowerCase().includes(lower) ||
			car.year.toString().includes(lower)
	})
})

const onBranchChange = (event: Event) => {
	const target = event.target as HTMLSelectElement
	const branchId = parseInt(target.value)
	if (branchId == 0) {
		return
	}
	axios.get(apiURL + '/admin/cars/' + branchId, {
		withCredentials: true
	}).then((response) => {
		cars.value = response.data
	}).catch((error) => {
		console.error(error)
	})
}

const status = (carStatus: string) => {
	switch (carStatus) {
		case 'reserve':
			return 'ถูกจอง'
		case 'unavailable':
			return 'อยู่ในระหว่างการซ่อมแซม'
		case 'in_use':
			return 'อยู่ในระหว่างการใช้งาน'
	}
}

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1>รายการรถยนต์</h1>
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<tr v-if="isRoot">
				<th colspan="6">
					<select v-model="rootBranchId" @change="onBranchChange($event)">
						<option :key="branch.branch_id" v-for="branch in rootBranches" :value="branch.branch_id">
							{{ branch.branch_name }}
						</option>
					</select>
					<button :disabled="rootBranchId == 0" @click="$router.push('/adminpanel/new/car/' + rootBranchId)">เพิ่มรถ</button>
				</th>
			</tr>
			<tr>
				<th colspan="6">
					<input type="text" placeholder="ค้นหา" v-model="searchText" />
				</th>

			</tr>
			<tr>
				<th>รูป</th>
				<th>ทะเบียน</th>
				<th>ยี่ห้อ</th>
				<th>รุ่น</th>
				<th>ปี</th>
				<th>สถานะ</th>
			</tr>
			<tr :key="car.car_id" v-for="car in filteredCars">
				<td>
					<img :src="car.image_car" width="100" height="100" />
				</td>
				<td>{{ car.license_plate }}</td>
				<td>{{ car.brand }}</td>
				<td>{{ car.model }}</td>
				<td>{{ car.year }}</td>
				<td>
					<router-link :to="'/adminpanel/car/' + car.car_id" v-if="car.car_status == 'not_reserve'" class="admin-table-available">ว่าง</router-link>
					<router-link :to="'/adminpanel/car/' + car.car_id" v-else class="admin-table-reserved">{{ status(car.car_status) }}</router-link>
				</td>
			</tr>
		</table>
	</div>
</template>