<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue';

import SearchCar from '../components/SearchCar.vue'
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
						<img src="/src/assets/home_cover.jpg" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>ฟุตบอลอยู่ไหน</h1>
							<p>
								อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน
								อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน
								อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน
								อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน อยู่ข้างบน
							</p>
						</div>
					</CardContainer>
					<CardContainer class="cardside">
						<img src="/src/assets/home_cover.jpg" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>แล้วจะเล่นบอลยังไง</h1>
							<p>
								ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น 
								ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น 
								ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น 
								ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น ไม่ต้องเล่น 
							</p>
						</div>
					</CardContainer>
					<CardContainer class="cardside">
						<img src="/src/assets/home_cover.jpg" alt="Nissan" class="card-img-thumb"/>
						<div class="cardside-content-big">
							<h1>ไม่ต้องเล่น แล้วจะทำอะไร</h1>
							<p>
								ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี 
								ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี 
								ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี 
								ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี ไปทำความดี 
							</p>
						</div>
					</CardContainer>
				</div>
			</ContentCenter>
		</div>
	</div>
</template>