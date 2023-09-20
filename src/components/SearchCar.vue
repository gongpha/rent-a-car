<script lang="ts">
import { defineComponent } from 'vue'
import { reactive } from 'vue'

import Card from './Card.vue'
import BranchPicker from './BranchPicker.vue'

import VueDatePicker from '@vuepic/vue-datepicker';
import { PartialTimeObj } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { ref } from 'vue'

interface SearchInfo {
	branchStartID: number
	diffPlace: boolean
	branchEndID: number

	startDate: Date
	endDate: Date
}
export default defineComponent({
	components: { Card, BranchPicker, VueDatePicker },
	setup() {
		const searchOption = reactive<SearchInfo>({} as SearchInfo);

		const today = new Date();
		const lessThan30 = today.getMinutes() < 30;
		const minT : PartialTimeObj = { hours : lessThan30 ? today.getHours() : today.getHours() + 1, minutes : lessThan30 ? 30 : 0 };
		const minTime = [minT, { hours : 12, minutes : 0 }] as PartialTimeObj[];

		return {
			searchOption, minTime
		}
	}
})
</script>

<template>
	<Card>
		<div class="searchcar-layout">
			<div class="branch-picker">
				<b>สถานที่รับรถ</b>
				<BranchPicker/>
			</div>
			<div v-if="searchOption.diffPlace" class="branch-picker">
				<b>สถานที่ส่งรถ</b>
				<BranchPicker/>
			</div>
		</div>
		<div class="searchcar-layout">
			<div class="branch-picker">
				<b>วันรับส่งคืนรถ</b>
				<VueDatePicker
				v-model="searchOption.startDate" 
				range
				dark
				minutes-increment="30"
				minutes-grid-increment="30"
				time-picker-inline
				:min-date="new Date()"
				:end-date="new Date(new Date().setDate(new Date().getDate() + 1))"
				:multi-calendars="{ solo: true }"
				:start-time="minTime"
				:no-minutes-overlay="true"
				placeholder="เลือกวันที่"
				select-text="เลือก"
				cancel-text="ยกเลิก"
				confirm-text="ตกลง"
				></VueDatePicker>
			</div>
		</div>
		<div>
			<input
			type="checkbox"
			v-model="searchOption.diffPlace"
			>
			จุดรับรถและส่งรถต่างกัน
		</div>
	</Card>
</template>