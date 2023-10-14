<script setup lang="ts">
import CardContainer from '@/components/CardContainer.vue';
import ContentCenter from '../components/ContentCenter.vue'

import SearchCar from '../components/SearchCar.vue'
import VueMultiselect from 'vue-multiselect'

// @ts-ignore
import HistogramSlider from "vue3-histogram-slider";
import "vue3-histogram-slider/dist/histogram-slider.css";
import { apiURL } from '@/envvars';

import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import axios from 'axios';

import { getFuel, getGear } from '@/utils/texts';

export interface Car {
	brand: string;
	car_id: number;
	car_image: string;
	car_type: string;
	fuel_type: string;
	model: string;
	price_per_day: number;
	seats: number;
	year: string;
	gear: string;
}

const route = useRoute()
const router = useRouter()
const prices = ref<number[]>([])
const cars = ref<Car[]>([])
const total = ref<number>(0)
const loadingCars = ref<boolean>(false)
const loadingMore = ref<boolean>(false)

const branchStartID = ref<any>(0)
const branchEndID = ref<any>(0)

const filterFuels = ref<string[]>([])
const fuels = ref([
	'เบนซิน',
	'ดีเซล',
])
const fuelsConst = [
	'benzin',
	'diesel',
]
const filterCarTypes = ref<string[]>([])
const carTypes = ref([
	'รถรุ่นประหยัด',
	'รถรุ่นปานกลาง',
	'รถ SUV',
])
const carTypesConst = [
	'eco',
	'mid',
	'suv',
]
const filterGears = ref<string[]>([])
const gears = ref([
	'แมนนวล',
	'ออโต้',
])
const gearsConst = [
	'manual',
	'auto',
]

const filterBrands = ref<string[]>([])
const brands = ref<string[]>([])

const sortBy = ref<{type: string, name: string, desc: boolean}>(
	{type:'price', name:'ราคา (น้อยไปมาก)', desc:false}
)
const sortByConst = [
	{type:'price', name:'ราคา (น้อยไปมาก)', desc:false},
	{type:'price', name:'ราคา (มากไปน้อย)', desc:true},
	{type:'seats', name:'จำนวนที่นั่ง (น้อยไปมาก)', desc:false},
	{type:'seats', name:'จำนวนที่นั่ง (มากไปน้อย)', desc:true},
	{type:'year', name:'ปี (น้อยไปมาก)', desc:false},
	{type:'year', name:'ปี (มากไปน้อย)', desc:true},
	{type:'brand', name:'ยี่ห้อ (ก่อน-หลัง)', desc:false},
	{type:'brand', name:'ยี่ห้อ (หลัง-ก่อน)', desc:true},
]

onMounted(() => {
	branchStartID.value = route.query.branchStartID
	branchEndID.value = route.query.branchEndID

	axios.get(apiURL + '/brandlist')
		.then((res) => {
			brands.value = res.data
		})
		.catch((err) => {
			console.log(err)
		})
	
	refreshCars()
	refreshPrices()
})

function refreshCars() {
	loadingCars.value = true
	axios.get(apiURL + '/cars/' + route.query.branchStartID, {
		params: {
			limit: 20,
			offset: 0,
			minPrice: route.query.minPrice,
			maxPrice: route.query.maxPrice,
			seats: route.query.seats,

			filterFuels: filterFuels.value.map((v : string) => fuelsConst[fuels.value.indexOf(v)]),
			filterCarTypes: filterCarTypes.value.map((v : string) => carTypesConst[carTypes.value.indexOf(v)]),
			filterGears: filterGears.value.map((v : string) => gearsConst[gears.value.indexOf(v)]),
			filterBrands: filterBrands.value,

			sortBy: sortBy.value.type,
			sortDesc: sortBy.value.desc ? 1 : undefined,
		}
	})
		.then((res) => {
			cars.value = res.data.cars
			total.value = res.data.total
			loadingCars.value = false
		})
		.catch((err) => {
			console.log(err)
		})
}

function refreshPrices() {
	prices.value = [];
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
}

function refreshCarsPress(query : {}) {
	query = {
		...query,
		minPrice: undefined,
		maxPrice: undefined,
	}
	router.replace({
		query: query
	}).then(() => {
		refreshCars()
		refreshPrices()
	})
}

const onScroll = function (e : Event) {
	if (window.scrollY >= (document.documentElement.scrollHeight - document.documentElement.clientHeight) - 30) {
		// load more
		if (total.value <= cars.value.length) return
		loadingMore.value = true
		axios.get(apiURL + '/cars/' + route.query.branchStartID, {
			params : {
				limit: 20,
				offset: cars.value.length
			}
		})
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

function updatePriceRange(pos : {from : number, to : number}) {
	router.replace({
		query: {
			...route.query,
			minPrice: pos.from,
			maxPrice: pos.to
		}
	}).then(() => {
		refreshCars()
	})
}

function reserve(carId : number) {
	const query = {
		branchStartID: route.query.branchStartID,
		branchEndID: route.query.branchEndID,
		startDate: (route.query.startDate instanceof Date) ? route.query.startDate.toISOString() : route.query.startDate,
		endDate: (route.query.endDate instanceof Date) ? route.query.endDate.toISOString() : route.query.endDate,

		carId: carId
	}

	router.push({
		path: '/addons',
		query: query
	})
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
	<div class="searchcar-pin">
		<SearchCar mini useEmit @search="refreshCarsPress"
			:startBranchStartID="branchStartID"
			:startBranchEndID="branchEndID"
			:startDate="new Date(route.query.startDate as string)"
			:endDate="new Date(route.query.endDate as string)"
		/>
	</div>
	<div id="search">
		<ContentCenter class="wide-limit">
			<div class="two-col">
				<CardContainer class="tc-left">
					<h3>กรองผลการค้นหา</h3>
					<h4>ราคาต่อวัน</h4>
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
						@finish="updatePriceRange"

						v-bind:min="route.query.minPrice"
						v-bind:max="route.query.maxPrice"
					/>
					<VueMultiselect
						placeholder="เลือกเฉพาะชนิดรถ"
						:show-labels="false"
						:multiple="true"
						:options="carTypes"
						v-model="filterCarTypes"
						@select="refreshCars"
						@remove="refreshCars"
					></VueMultiselect>
					<VueMultiselect
						placeholder="เลือกเฉพาะระบบเชื้อเพลิง"
						:show-labels="false"
						:multiple="true"
						:options="fuels"
						v-model="filterFuels"
						@select="refreshCars"
						@remove="refreshCars"
					></VueMultiselect>
					<VueMultiselect
						placeholder="เลือกเฉพาะระบบเกียร์"
						:show-labels="false"
						:multiple="true"
						:options="gears"
						v-model="filterGears"
						@select="refreshCars"
						@remove="refreshCars"
					></VueMultiselect>
					<VueMultiselect
						placeholder="เลือกเฉพาะยี่ห้อรถ"
						:show-labels="false"
						:multiple="true"
						:options="brands"
						v-model="filterBrands"
						@select="refreshCars"
						@remove="refreshCars"
					></VueMultiselect>
				</CardContainer>
				<div class="tc-right car-list" v-if="!loadingCars">
					<h1>ผลการค้นหา</h1>
					<div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
						<div>
							<h3>มีรถว่างทั้งหมด {{ total }} คัน</h3>
						</div>
						<VueMultiselect
							:searchable="false"
							style="width: 300px;"
							placeholder="เลือกวิธีการเรียง"
							:show-labels="false"
							label="name"
							:options="sortByConst"
							v-model="sortBy"
							@select="refreshCars"
							@remove="refreshCars"
						></VueMultiselect>
					</div>
					<CardContainer class="car-card cardside" v-for="car in cars" v-bind:key="car.car_id">
						<img :src="car.car_image" class="card-img-thumb-mid">
						<div class="cardside-content">
							<h3 class="force-black">{{ car.brand }} {{ car.model }} {{ car.year }}</h3>
							<h2><span class="price-prefix">฿</span><span class="price-number">{{ car.price_per_day.toLocaleString() }}</span></h2>
							<div class="cardside-content-info">
								<div class="car-property-row">
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ชนิดรถ'">
											<i class="icon-car car-property-icon"/>
										</div>
										{{ car.car_type }}
									</div>
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'จำนวนที่นั่ง'">
											<i class="icon-seat car-property-icon"/>
										</div>
										{{ car.seats }} ที่นั่ง
									</div>
								</div>
								<div class="car-property-row">
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ระบบเชื้อเพลิง'">
											<i class="icon-fuel car-property-icon"/>
										</div>
										{{ getFuel(car.fuel_type) }}
									</div>
									<div class="car-property">
										<div class="car-property-iconframe" v-tooltip="'ระบบเกียร์'">
											<i class="icon-gear car-property-icon"/>
										</div>
										{{ getGear(car.gear) }}
									</div>
								</div>
							</div>
							<button class="button" @click="reserve(car.car_id)">เช่าเลย</button>
						</div>
					</CardContainer>
					<h3 v-if="loadingMore">กำลังโหลดเพื่ม . . .</h3>
				</div>
				<div class="tc-right car-list" v-else>
					Loading . . .
				</div>
			</div>
		</ContentCenter>
	</div>
</template>