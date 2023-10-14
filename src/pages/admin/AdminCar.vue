<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { VueCookies } from 'vue-cookies'
import { apiURL } from '../../envvars';
import { inject } from 'vue';
import { type Model } from './AdminCarModel.vue'

export interface Car {
	model_id: number,
	license_plate: string,
	car_status: string,
	car_id: number,
	image_car: string,
	mileage: number,

	reservation_id: number,

	brand: string,
	model: string,
	year: number
}

const models = ref<{
					[key: string]: Model;
				}>({
	0: {
		model_id: 0,
		brand: '',
		model: '',
		year: 0,
		seats: 0,
		price_per_day: 0,
		fuel_type: '',
		car_type: '',
		gear: '',

		count: 0,
	}
})

const car = ref<Car>({
	model_id: 0,
	license_plate: '',
	car_status: '',
	car_id: 0,
	image_car: '',
	mileage: 0,

	reservation_id: 0,

	brand: '',
	model: '',
	year: 0
})

const permissions = ref('[]')


const $cookies = inject<VueCookies>('$cookies')
const route = useRoute()
const router = useRouter()
const newPage = ref(false)

onMounted(async () => {
	await router.isReady();

	newPage.value = route.meta.newPage ? true : false

	if (newPage.value) {
		car.value.model_id = 1
		await pullModels()
		return
	}

	axios.get(apiURL + '/admin/car/' + route.params.carId, {
		withCredentials: true
	}).then(async (response) => {
		// car data
		const carData = response.data
		permissions.value = carData.permissions
		await pullModels()
		car.value = carData
		
	}).catch((error) => {
		console.error(error)
	})
});

async function pullModels() {
	const response = await axios.get(apiURL + '/admin/models', {
		withCredentials: true
	})
	for (const model of response.data.models) {
		models.value[model.model_id] = model
	}
	delete models.value[0]
}

function new_and_save() {
	const formData = new FormData()

	formData.append('mileage', car.value.mileage.toString())
	formData.append('license_plate', car.value.license_plate)
	formData.append('model_id', car.value.model_id.toString())
	formData.append('car_status', car.value.car_status)

	const file = (document.getElementById('img') as HTMLInputElement).files![0]

	if (file != null) {
		formData.append('img', file)
	}

	axios.post(apiURL + '/admin/add/car/' + route.params.branchId, formData, {
		withCredentials: true,
		headers: {
			'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
		},
	}).then((response) => {
		document.location.href = '/adminpanel/cars';
	}).catch((error) => {
		console.error(error)
	})
}

function upload_and_save() {
	if (car.value.license_plate == '') {
		alert('กรุณากรอกทะเบียนรถ')
		return
	}

	if (car.value.mileage < 0) {
		alert('กรุณากรอกจำนวนกม. ที่วิ่งไป')
		return
	}

	if (car.value.car_status == '') {
		alert('กรุณาเลือกสถานะ')
		return
	}


	if (newPage.value) {
		new_and_save()
		return
	}
	const file = (document.getElementById('img') as HTMLInputElement).files![0]
	
	const formData = new FormData()

	formData.append('mileage', car.value.mileage.toString())
	formData.append('license_plate', car.value.license_plate)
	formData.append('model_id', car.value.model_id.toString())
	formData.append('car_status', car.value.car_status)

	if (file != null) {
		formData.append('img', file)
	}

	axios.post(apiURL + '/admin/edit/car/' + route.params.carId, formData, {
		withCredentials: true,
		headers: {
			'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
		},
	}).then((response) => {
		document.location.href = '/adminpanel/cars';
	}).catch((error) => {
		console.error(error)
	})
}

function deleteCar() {
	if (!confirm('คุณต้องการลบรถยนต์นี้ใช่หรือไม่')) {
		return
	}
	axios.delete(apiURL + '/admin/delete/car/' + route.params.carId, {
		withCredentials: true,
		headers: {
			'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
		},
	}).then((response) => {
		document.location.href = '/adminpanel/cars';
	}).catch((error) => {
		console.error(error)
	})
}

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1 v-if="!newPage">รถยนต์ {{ car.license_plate }}</h1>
		<h1 v-else>เพิ่มรถยนต์</h1>
		<img :src="car.image_car" alt="รูปรถ" />
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<th colspan="4" v-if="!newPage">
				แก้ไขข้อมูล
				<td v-if="permissions.includes('D')">
					<button @click="deleteCar">ลบรถ</button>
				</td>
			</th>
			<th colspan="4" v-else>
				เพิ่มข้อมูล
			</th>
			<tr>
				<td>ทะเบียน</td>
				<td><input type="text" v-model="car.license_plate" /></td>
			</tr>
			<tr>
				<td>รุ่นรถยนต์</td>
				<td>
					<select v-model="car.model_id">
						<option :key="model.model_id" v-for="model in models" :value="model.model_id">
							{{ model.brand }} {{ model.model }} ({{ model.count }})
						</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>ยี่ห้อ</td>
				<td><input disabled type="text" v-model="models[car.model_id].brand" /></td>
			</tr>
			<tr>
				<td>รุ่น</td>
				<td><input disabled type="text" v-model="models[car.model_id].model" /></td>
			</tr>
			<tr>
				<td>ปี</td>
				<td><input disabled type="text" v-model="models[car.model_id].year" /></td>
			</tr>
			<tr>
				<td>จำนวนที่นั่ง</td>
				<td><input disabled type="text" v-model="models[car.model_id].seats" /></td>
			</tr>
			<tr>
				<td>ราคาเช่าต่อวัน</td>
				<td><input disabled type="text" v-model="models[car.model_id].price_per_day" /></td>
			</tr>
			<tr>
				<td>ประเภทเชื้อเพลิง</td>
				<td><input disabled type="text" v-model="models[car.model_id].fuel_type" /></td>
			</tr>
			<tr>
				<td>จำนวนกม. ที่วิ่งไป</td> <!-- fixme -->
				<td><input type="text" v-model="car.mileage" /></td>
			</tr>
			<tr>
				<td>รูปใหม่</td>
				<td>
					<input type="file" id="img" name="img" accept="image/*">
				</td>
			</tr>
			<tr>
				<td><b>สถานะ</b></td>
				<td>
					<select :disabled="!permissions.includes('s')" v-model="car.car_status">
						<option value="not_reserve">ว่าง</option> <!--available-->
						<option value="reserve">ถูกจอง</option>
						<option value="in_use">อยู่ในระหว่างการใช้งาน</option>
						<option value="unavailable">อยู่ในระหว่างการซ่อมแซม</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>ถูกจองโดย</td>
				<td>
					<router-link class="admin-table-not-empty" v-if="car.reservation_id" :to="'/adminpanel/reservation/' + car.reservation_id">
						#{{ car.reservation_id }}
					</router-link>
					<span v-else>ไม่ถูกจอง</span>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<button @click="upload_and_save">บันทึก</button>
				</td>
			</tr>
		</table>
	</div>
</template>