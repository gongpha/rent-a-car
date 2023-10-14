<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { apiURL } from '../../envvars';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { VueCookies } from 'vue-cookies'
import { inject } from 'vue';

export interface Model {
	model_id: number,
	brand: string,
	model: string,
	year: number,
	seats: number,
	car_type: string,
	price_per_day: number,
	fuel_type: string,
	gear: string,

	count: number,
}

const model = ref<Model>({
	model_id: 0,
	brand: '',
	model: '',
	year: 0,
	seats: 0,
	car_type: '',
	price_per_day: 0,
	fuel_type: '',
	gear: '',

	count: 0,
})


const $cookies = inject<VueCookies>('$cookies')
const route = useRoute()
const router = useRouter()
const permissions = ref('')
const newPage = ref(false)

function save() {
	if (!model.value.brand || !model.value.model || !model.value.year || !model.value.seats || !model.value.price_per_day) {
		alert('กรุณากรอกข้อมูลให้ครบถ้วน')
		return
	}

	if (!model.value.car_type || !model.value.fuel_type || !model.value.gear) {
		alert('กรุณากรอกข้อมูลให้ครบถ้วน')
		return
	}

	if (newPage.value) {
		axios.post(apiURL + '/admin/add/model', {
			brand: model.value.brand,
			model: model.value.model,
			year: model.value.year,
			seats: model.value.seats,
			price_per_day: model.value.price_per_day,
			fuel_type: model.value.fuel_type,
			car_type: model.value.car_type,
			gear: model.value.gear
		}, {
			withCredentials: true,
			headers: {
				'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
			},
		}).then((response) => {
			document.location.href = '/adminpanel/models';
		}).catch((error) => {
			console.error(error)
		})
	} else {
		axios.post(apiURL + '/admin/edit/model/' + route.params.modelId, {
			brand: model.value.brand,
			model: model.value.model,
			year: model.value.year,
			seats: model.value.seats,
			price_per_day: model.value.price_per_day,
			fuel_type: model.value.fuel_type,
			car_type: model.value.car_type,
			gear: model.value.gear
		}, {
			withCredentials: true,
			headers: {
				'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
			},
		}).then((response) => {
			document.location.href = '/adminpanel/models';
		}).catch((error) => {
			console.error(error)
		})
	}

	
}

onMounted(async() => {
	axios.get(apiURL + '/admin/model/' + route.params.modelId, {
		withCredentials: true
	}).then((response) => {
		// car data
		model.value = response.data
		permissions.value = response.data.permissions
	}).catch((error) => {
		console.error(error)
	})

	await router.isReady();

	newPage.value = route.meta.newPage ? true : false
});

function deleteModel() {
	if (!confirm('คุณต้องการลบรุ่นรถยนต์นี้ใช่หรือไม่')) {
		return
	}
	axios.delete(apiURL + '/admin/delete/model/' + route.params.modelId, {
		withCredentials: true,
		headers: {
			'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
		},
	}).then((response) => {
		document.location.href = '/adminpanel/models';
	}).catch((error) => {
		console.error(error)
	})
}

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1 v-if="!newPage">รุ่นรถยนต์ {{ model.brand }} {{ model.model }} {{ model.year }}</h1>
		<h1 v-else>เพิ่มรุ่นรถยนต์</h1>
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<th colspan="4" v-if="newPage">
				เพิ่มข้อมูล
			</th>
			<th colspan="4" v-else-if="permissions.includes('U')">
				แก้ไขข้อมูล
				<td v-if="permissions.includes('D')">
					<button @click="deleteModel" :disabled="model.count != 0">ลบรุ่นรถ</button>
				</td>
			</th>
			<th colspan="4" v-else>
				ข้อมูล
			</th>
			<tr>
				<td>ยี่ห้อ</td>
				<td><input :disabled="!permissions.includes('U') && !newPage" type="text" v-model="model.brand" /></td>
			</tr>
			<tr>
				<td>รุ่น</td>
				<td><input :disabled="!permissions.includes('U') && !newPage" type="text" v-model="model.model" /></td>
			</tr>
			<tr>
				<td>ปี</td>
				<td><input :disabled="!permissions.includes('U') && !newPage" type="text" v-model="model.year" /></td>
			</tr>
			<tr>
				<td>จำนวนที่นั่ง</td>
				<td><input :disabled="!permissions.includes('U') && !newPage" type="text" v-model="model.seats" /></td>
			</tr>
			<tr>
				<td>ราคาเช่าต่อวัน</td>
				<td><input :disabled="!permissions.includes('U') && !newPage" type="text" v-model="model.price_per_day" /></td>
			</tr>
			<tr>
				<td>ประเภทเชื้อเพลิง</td>
				<td>
					<select :disabled="!permissions.includes('U') && !newPage" v-model="model.fuel_type">
						<option value="diesel">Diesel</option>
						<option value="benzin">Benzin</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>ขนาดรถ</td>
				<td>
					<select :disabled="!permissions.includes('U') && !newPage" v-model="model.car_type">
						<option value="Eco">Eco</option>
						<option value="Mid">Mid</option>
						<option value="SUV">SUV</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>ระบบเกียร์</td>
				<td>
					<select :disabled="!permissions.includes('U') && !newPage" v-model="model.gear">
						<option value="manual">แมนนวล</option>
						<option value="auto">ออโต้</option>
					</select>
				</td>
			</tr>
			<tr v-if="permissions.includes('U') || newPage" >
				<td colspan="2">
					<button @click="save">บันทึก</button>
				</td>
			</tr>
		</table>
	</div>
</template>