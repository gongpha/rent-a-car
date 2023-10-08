<script setup lang="ts">
import axios from 'axios';
import AdminNav from '../../components/AdminNav.vue'
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { VueCookies } from 'vue-cookies'
import { apiURL } from '../../envvars';
import { inject } from 'vue';
import { type Reservation } from './AdminReservations.vue'

const rsv = ref<Reservation>({
	id: 0,
	c_first_name: '',
	c_last_name: '',
	car_image: '',
	car_plate: '',
	car_mileage: 0,
	car_id: 0,
	model_id: 0,
	model_brand: '',
	model_model: '',
	model_year: 0,
	start: new Date(),
	end: new Date(),
	status: 'RESERVED',
	actions: '',
	note: ''
})


const $cookies = inject<VueCookies>('$cookies')
const route = useRoute()
const router = useRouter()

onMounted(async () => {
	await router.isReady();

	axios.get(apiURL + '/admin/reservation/' + route.params.rsvId, {
		withCredentials: true
	}).then((response) => {
		rsv.value = response.data
		
	}).catch((error) => {
		console.error(error)
	})
});

function commit(url : string, msg : string, has_reason : boolean = false) {
	let reason : null | string = null;
	if (has_reason) {
		reason = prompt('กรุณาใส่เหตุผลที่ต้องการเพิกถอนการจอง')
		if (!reason) {
			return
		}
	}
	else if (!confirm(msg)) {
		return
	}
	axios.post(apiURL + '/admin/reservation/' + route.params.rsvId + url, {}, {
		withCredentials: true,
		headers: {
			'X-CSRF-TOKEN': $cookies?.get('csrf_access_token'),
		},
		params: (
			has_reason ? {
				reason: reason
			} : {}
		)
	}).then((response) => {
		document.location.href = '/adminpanel/reservation/' + route.params.rsvId;
	}).catch((error) => {
		console.error(error)
	})
}

function cancel() {
	commit('/cancel', 'กรุณาหมายเหตุที่ต้องเพิกถอน', true)
}

function markInUse() {
	commit('/inuse', 'คุณต้องการทำเครื่องหมายว่า "กำลังถูกไปใช้งาน" หรือไม่ ?')
}

function markInUseUndo() {
	commit('/inuseundo', 'คุณต้องการเลิกทำเครื่องหมาย "กำลังถูกไปใช้งาน" หรือไม่ ?')
}

function markCompleted() {
	commit('/complete', 'คุณต้องการทำเครื่องหมายว่า "นำมาคืนแล้ว" หรือไม่ ?')
}

</script>

<template>
	<AdminNav/>
	<div class="admin-content">
		<h1>การจองหมายเลข #{{ rsv.id }}</h1>
		<img :src="rsv.car_image" alt="รูปรถ" />
		<table class="admin-table" cellpadding="0" cellspacing="0">
			<th colspan="4">
				ข้อมูลการจอง
			</th>
			<tr>
				<td>รถทะเบียน</td>
				<td>
					<router-link class="admin-table-not-empty" :to="'/adminpanel/car/' + rsv.car_id">
						{{ rsv.car_plate }} (วิ่งไปแล้ว {{ rsv.car_mileage }} กม.) <!-- fixme -->
					</router-link>
				</td>
			</tr>
			<tr>
				<td>รุ่นรถยนต์</td>
				<td>
					<router-link class="admin-table-not-empty" :to="'/adminpanel/model/' + rsv.model_id">
						{{ rsv.model_brand }} {{ rsv.model_model }} {{ rsv.model_year }}
					</router-link>
				</td>
			</tr>
			<tr>
				<td>ชื่อลูกค้า</td>
				<td>{{ rsv.c_first_name }} {{ rsv.c_last_name }}</td>
			</tr>
			<tr>
				<td>วันที่เริ่มใช้</td>
				<td>{{ rsv.start }}</td>
			</tr>
			<tr>
				<td>วันที่สิ้นสุด</td>
				<td>{{ rsv.end }}</td>
			</tr>
			<tr>
				<td>สถานะ</td>
				<td>
					<span v-if="rsv.status == 'RESERVED'">รถยังไม่ถูกนำไปใช้งาน</span>
					<span v-if="rsv.status == 'IN_USE'">รถกำลังถูกนำไปใช้งาน</span>
					<span v-if="rsv.status == 'COMPLETED'">รถถูกนำมาคืนแล้ว</span>
					<span v-if="rsv.status == 'CANCELED'">การจองถูกยกเลิก</span>
				</td>
			</tr>
			<tr v-if="rsv.note.length !== 0">
				<td>หมายเหตุ</td>
				<td>{{ rsv.note }}</td>
			</tr>
			<tr><td>&nbsp;</td><td></td></tr>
			<tr>
				<td></td>
				<td><button :disabled="!rsv.actions.includes('c')" @click="cancel">เพิกถอนการจอง</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button :disabled="!rsv.actions.includes('i')" @click="markInUse">ทำเครื่องหมายว่า "กำลังถูกไปใช้งาน"</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button :disabled="!rsv.actions.includes('u')" @click="markInUseUndo">เลิกทำเครื่องหมาย "กำลังถูกไปใช้งาน"</button></td>
			</tr>
			<tr>
				<td></td>
				<td><button :disabled="!rsv.actions.includes('C')" @click="markCompleted">ทำเครื่องหมายว่า "นำมาคืนแล้ว"</button></td>
			</tr>
		</table>
	</div>
</template>