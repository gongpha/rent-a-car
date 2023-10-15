<script setup lang="ts">

import ContentCenter from '@/components/ContentCenter.vue';
import CardContainer from '@/components/CardContainer.vue';
import axios from 'axios';
import { apiURL } from '@/envvars';
import { onMounted, ref } from 'vue';
import { getThaiDate } from '@/utils/texts';

interface ReservationInfo {
	car_image: string;
	start_date: string;
	end_date: string;
	reservation_id: number;
	status: string;

	created_at: string;
}

const reservations = ref<ReservationInfo[]>([]);

onMounted(() => {
	axios.get(apiURL + '/reservations', {
		withCredentials: true
	})
		.then((res) => {
			reservations.value = res.data.reservations;
		})
		.catch((err) => {
			console.log(err);
		});
});

</script>

<template>
	<ContentCenter class="wide-limit">
		<h1>การจองของคุณ</h1>
		<div v-if="reservations.length === 0">
			<CardContainer class="card-minimal">
				ไม่พบการจองใด ๆ
			</CardContainer>
		</div>
		<div v-else>
			<CardContainer class="card-minimal" v-for="resv in reservations" v-bind:key="resv.reservation_id">
				<div class="cardside">
					<img :src="resv.car_image" class="card-img-thumb-tiny">
					<div class="cardside-content" style="width: 100%">
						<div class="resv-head">
							<router-link :to="'/reservation/'+resv.reservation_id"><h3># {{ resv.reservation_id }}</h3></router-link>
							<span style="color: #0A4" v-if="resv.status == 'completed'">
								การจองเสร็จสมบูรณ์
							</span>
							<span style="color: #A40" v-else-if="resv.status == 'canceled'">
								การจองถูกยกเลิก
							</span>
							<span style="color: rgb(0, 122, 170)" v-else>
								อยู่ในระหว่างการจอง
							</span>
						</div>
						<div class="mid-desc">
							สร้างเมื่อ {{ getThaiDate(new Date(resv.created_at)) }}
							<br/>
							{{ getThaiDate(new Date(resv.start_date)) }} - {{ getThaiDate(new Date(resv.end_date)) }}
						</div>
					</div>
				</div>
			</CardContainer>
		</div>
	</ContentCenter>

</template>