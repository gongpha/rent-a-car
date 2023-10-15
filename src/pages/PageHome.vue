<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue';

import SearchCar from '../components/SearchCar.vue'
import { ref } from 'vue';

const email = ref('');
const resvID = ref('');

const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
import { popup } from '@/utils/texts';
import { useRouter } from 'vue-router';

const resvIDField = ref<HTMLElement | null>(null)
const emailField = ref<HTMLElement | null>(null)

const router = useRouter()

function submit() {
	if (!resvID.value) {
		popup(resvIDField.value!, "กรุณากรอกหมายเลขการจอง")
		return
	}
	if (!emailField.value) {
		popup(emailField.value!, "กรุณากรอกอีเมล")
		return
	}
	if (!emailCheck.test(email.value)) {
		popup(emailField.value!, "กรุณากรอกอีเมลให้ถูกต้อง")
		return
	}

	router.push({
		path: '/reservation/' + resvID.value,
		query: {
			email: email.value,
		}
	})
}

</script>

<template>
	<div id="home">
		<div class="header-img-root">
			<img src="/src/assets/home_cover.jpg" alt="Nissan" class="header-img"/>
		</div>
		<div class="searchcar-float">
			<ContentCenter class="wide-limit">
				<div>
					<h1 class="header-center">ไปเช่ารถ เพื่อออกเดินทางไกล</h1>
					<h2 class="header-center">เดินทางไกล ?</h2>
				</div>
				<SearchCar/>
			</ContentCenter>
		</div>
		<div style="margin-top: 50px;">
			<ContentCenter class="wide-limit">
				<div>
					<h1 style="margin-top: 75px;">ทำไมต้อง RentACar</h1>
					<CardContainer class="cardside">
						<img src="/src/assets/cheap.jpg" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>ราคาถูก</h1>
							<p>
								RentACar ของเราสามารถบอกคุณได้ว่าเป็นเว็บที่ให้เช่ารถยนต์ที่ถูกที่สุดในประเทศไทย 
								โดยเรามีรถให้เช่าทั้งรถ economic รถ middle รถ SUV  ให้คุณได้เลือกเช่าตามความต้องการของคุณ

							</p>
						</div>
					</CardContainer>
					<CardContainer class="cardside">
						<img src="/src/assets/driver.png" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>มีคนขับรถไปถึงที่ต้องการแทนคุณ</h1>
							<p>
								RentACar ของเรามี option ที่คุณสามารถเลือกได้ว่า จะขับรถเอง 
								หรือ จะให้คนขับมาขับรถแทนได้ง่ายๆ พร้อมให้บริการคุณตลอดการเดินทางตามระยะเวลาที่คุณต้องการ
								แค่กดปุ่มเลือกเอาคนขับ คุณก็จะได้คนขับมาขับรถแทนคุณได้แล้ว !!!
							</p>
						</div>
					</CardContainer>
					<CardContainer class="cardside">
						<img src="/src/assets/stepreserve.jpg" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>ขั้นตอนการจองแบบทันใจ</h1>
							<p>
								การจองรถของ RentACar ของเราเป็นขั้นตอนที่ง่าย และทันใจ 
								โดยให้ผู้เช่ารถเลือกวันที่ เวลา และสถานที่, เลือกรถ, กรอกข้อมูลส่วนตัว, และชำระเงินอย่างรวดเร็วผ่านระบบ
							</p>
						</div>
					</CardContainer>
					<CardContainer>
						<h1>ตรวจสอบการจอง</h1>
						<div class="form-card-body">
							<div class="form-input-text">
								<span class="form-label">หมายเลขการจอง</span>
								<input type="text" v-model="resvID" ref="resvIDField" />
							</div>
							<div class="form-input-text">
								<span class="form-label">อีเมลที่ใช้ทำการจอง</span>
								<input type="text" v-model="email" ref="emailField" />
							</div>
							<button class="button" @click="submit">
								ตรวจสอบ
							</button>
						</div>
					</CardContainer>
				</div>
			</ContentCenter>
		</div>
	</div>
</template>