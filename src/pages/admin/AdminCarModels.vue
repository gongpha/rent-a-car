<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { apiURL } from '../../envvars';
import { ref, onMounted } from 'vue';
import { type Model } from './AdminCarModel.vue'

const models = ref<Model[]>([])
const permissions = ref('')

onMounted(() => {
	axios.get(apiURL + '/admin/models', {
		withCredentials: true
	}).then((response) => {
		// model list
		models.value = response.data.models
		permissions.value = response.data.permissions
	}).catch((error) => {
		console.error(error)
	})
});

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1>รายการรุ่นรถยนต์</h1>
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<tr v-if="permissions.includes('A')">
				<th colspan="8">
					<button @click="$router.push('/adminpanel/new/model')">เพิ่มรุ่นรถ</button>
				</th>
			</tr>
			<tr>
				<th>ยี่ห้อ</th>
				<th>รุ่น</th>
				<th>ปี</th>
				<th>ขนาดรถ</th>
				<th>จำนวนที่นั่ง</th>
				<th>ระบบเชื้อเพลิง</th>
				<th>ราคาเช่าต่อวัน</th>
				<th>จำนวนรถ</th>
			</tr>
			<tr :key="model.model_id" v-for="model in models">
				<td>{{ model.brand }}</td>
				<td>{{ model.model }}</td>
				<td>{{ model.year }}</td>
				<td>{{ model.car_type }}</td>
				<td>{{ model.seats }}</td>
				<td>{{ model.fuel_type }}</td>
				<td>{{ model.price_per_day }}</td>
				<td>
					<router-link :to="'/adminpanel/model/' + model.model_id" class="admin-table-not-empty" v-if="model.count != 0">{{ model.count }}</router-link>
					<router-link :to="'/adminpanel/model/' + model.model_id" class="admin-table-empty" v-else>{{ model.count }}</router-link>
				</td>
			</tr>
		</table>
	</div>
</template>