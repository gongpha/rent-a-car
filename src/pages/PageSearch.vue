<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue'

import SearchCar from '../components/SearchCar.vue'

// @ts-ignore
import HistogramSlider from "vue3-histogram-slider";
import "vue3-histogram-slider/dist/histogram-slider.css";
import { apiURL } from '@/envvars';

import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import axios from 'axios';

interface Car {
	brand: string;
	car_id: number;
	car_image: string;
	car_type: string;
	fuel_type: string;
	model: string;
	price_per_day: number;
	seat: number;
	year: string;
}

const route = useRoute()
const prices = ref<number[]>([])
const cars = ref<Car[]>([])
const total = ref<number>(0)
const loadingMore = ref<boolean>(false)

onMounted(() => {
	axios.get(apiURL + '/cars/' + route.query.branchStartID + '?limit=20')
		.then((res) => {
			cars.value = res.data.cars
			total.value = res.data.total
		})
		.catch((err) => {
			console.log(err)
		})
	axios.get(apiURL + '/priceshist/' + route.query.branchStartID)
		.then((res) => {
			// decompress
			const pricesData : number[] = []
			for (let i = 0; i < res.data.length; i++) {
				for (let j = 0; j < res.data[i][1]; j++) {
					pricesData.push(res.data[i][0])
				}
			}
			prices.value = pricesData
		})
		.catch((err) => {
			console.log(err)
		})
})

const onScroll = function (e : Event) {
	if (window.scrollY >= window.scrollMaxY - 30) {
		// load more
		if (total.value <= cars.value.length) return
		loadingMore.value = true
		axios.get(apiURL + '/cars/' + route.query.branchStartID + '?limit=20&offset=' + cars.value.length)
			.then((res) => {
				cars.value = cars.value.concat(res.data.cars)
				loadingMore.value = false
			})
			.catch((err) => {
				console.log(err)
			})
	}
}

window.addEventListener('scroll', onScroll)

</script>

<template>
	<div class="searchcar-pin">
		<SearchCar mini/>
	</div>
	<div id="search">
		<ContentCenter class="wide-limit">
			<div class="two-col">
				<CardContainer class="tc-left">
					<h3>ราคาต่อวัน</h3>
					<HistogramSlider
						v-if="prices.length > 0"
						:primaryColor="`#00ceab`"
						:labelColor="`#00ceab`"
						:holderColor="`#eee`"
						:handleColor="`#00ceab`"
						:gridTextColor="`#00ceab`"
						:width="250"
						:bar-height="50"
						:grid="false"
						:data="prices"
						handleSize="20"
						fontFamily="'Prompt', sans-serif"
						updateColorOnChange="true"
					/>
				</CardContainer>
				<div class="tc-right car-list">
					<h1>ผลการค้นหา</h1>
					<h3>มีรถว่างทั้งหมด {{ total }} คัน</h3>
					<CardContainer class="car-card cardside" v-for="car in cars" v-bind:key="car.car_id">
						<img :src="car.car_image" class="card-img-thumb-mid">
						<div class="cardside-content">
							<h3 class="force-black">{{ car.brand }} {{ car.model }} {{ car.year }}</h3>
							<h2><span class="price-prefix">฿</span><span class="price-number">{{ car.price_per_day.toLocaleString() }}</span></h2>
							<div class="cardside-content-info">

							</div>
							<button class="button">เช่าเลย</button>
						</div>
					</CardContainer>
					<h3 v-if="loadingMore">กำลังโหลดเพื่ม . . .</h3>
				</div>
			</div>
		</ContentCenter>
	</div>
</template>