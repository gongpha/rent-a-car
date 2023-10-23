<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'

import CardContainer from './CardContainer.vue'
import BranchPicker from './BranchPicker.vue'

import VueDatePicker from '@vuepic/vue-datepicker';
import type { PartialTimeObj } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { createTooltip, destroyTooltip } from 'floating-vue'

import { apiURL } from '@/envvars'
import axios from 'axios'

export default defineComponent({
	components: { CardContainer, BranchPicker, VueDatePicker },

	data() {
		return {
			branchStartID: { id: undefined },
			diffPlace: false,
			branchEndID: { id: undefined },

			startEndDate: ([] as Date[]),

			options: ([] as any[]),
		}
	},

	emits: ['search'],

	props: {
		mini: {
			type: Boolean,
			default: false,
		},

		useEmit: {
			type: Boolean,
			default: false,
		},

		startBranchStartID: {
			default: 0,
		},

		startBranchEndID: {
			default: 0,
		},

		startDate: {
			default: undefined,
			type: Date,
		},

		endDate: {
			default: undefined,
			type: Date,
		},
	},

	setup() {
		const today = new Date();
		const lessThan30 = today.getMinutes() < 30;
		const minT : PartialTimeObj = { hours : lessThan30 ? today.getHours() : today.getHours() + 1, minutes : lessThan30 ? 30 : 0 };
		const minTime = [minT, { hours : 12, minutes : 0 }] as PartialTimeObj[];

		const branchStart = ref<HTMLElement | null>(null);
		const branchEnd = ref<HTMLElement | null>(null);
		const branchDate = ref<HTMLElement | null>(null);

		return {
			minTime,
			branchStart, branchEnd, branchDate
		}
	},

	mounted() {
		this.getBranches()
	},

	methods: {
		getBranches() {
			axios.get(apiURL + '/branches')
				.then(response => {
					let newOptions : any[] = [];
					response.data.branches.forEach((branch: any) => {
						newOptions.push({
							id: branch.branch_id,
							name: branch.branch_name,
						});
					});
					this.options = newOptions;

					this.branchStartID = this.options.find((option) => option.id == this.startBranchStartID);
					this.branchEndID = this.options.find((option) => option.id == this.startBranchEndID);
					if (!(this.endDate == undefined || this.startDate == undefined)) {
						this.startEndDate = [this.startDate, this.endDate]
					}
					
					this.diffPlace = this.branchStartID != this.branchEndID
				})
				.catch(error => {
					console.log(error);
				})
		},
		search() {
			if (this.branchStartID == undefined) {
				const tooltip = createTooltip(this.branchStart, {
					content: 'กรุณาเลือกสถานที่รับรถ',
				}, {})
				
				tooltip.show()
				setTimeout(() => {
					tooltip.hide()

					setTimeout(() => {
						destroyTooltip(this.branchStart)
						}, 500)
				}, 3000)
				return
			}
			if (this.diffPlace && this.branchEndID == undefined) {
				const tooltip = createTooltip(this.branchEnd, {
					content: 'กรุณาเลือกสถานที่ส่งคืนรถ',
				}, {})
				tooltip.show()
				setTimeout(() => {
					tooltip.hide()

					setTimeout(() => {
						destroyTooltip(this.branchEnd)
						}, 500)
				}, 3000)
				return
			}
			
			if (this.startEndDate.length == 0) {
				const tooltip = createTooltip(this.branchDate, {
					content: 'กรุณาเลือกวันรับรถและวันส่งรถ',
				}, {})
				tooltip.show()
				setTimeout(() => {
					tooltip.hide()

					setTimeout(() => {
						destroyTooltip(this.branchDate)
						}, 500)
				}, 3000)
				return
			}

			let arr : Date[] = this.startEndDate
			const query = {
				branchStartID: this.branchStartID.id,
				branchEndID: this.diffPlace ? this.branchEndID.id : this.branchStartID.id,
				startDate: (arr[0] instanceof Date) ? arr[0].toISOString() : arr[0],
				endDate: (arr[1] instanceof Date) ? arr[1].toISOString() : arr[1]
			}

			if (this.useEmit) {
				this.$emit('search', query)
				return
			}
			this.$router.push({
				path: '/search',
				query: query
			})
		},
	}
})
</script>

<template>
	<CardContainer v-bind:class="(mini)?'float-mini':'float'">
		<div v-bind:class="(mini)?'searchcar-layout-mini flexcol-100':'searchcar-layout'">
			<div class="branch-picker">
				<b>สถานที่รับรถ</b>
				<div ref="branchStart"><BranchPicker :options="options" v-model="branchStartID"/></div>
			</div>
			<div v-if="diffPlace" class="branch-picker">
				<b>สถานที่ส่งรถ</b>
				<div ref="branchEnd"><BranchPicker :options="options" v-model="branchEndID"/></div>
			</div>
		</div>
		<div v-bind:class="(mini)?'searchcar-layout-mini flexcol-50':'searchcar-layout'">
			<div class="branch-picker">
				<b>วันรับส่งคืนรถ</b>
				<div ref="branchDate">
					<VueDatePicker
					v-model="startEndDate" 
					range
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
		</div>
		<div v-bind:class="(mini)?'searchcar-layout minitwo flexcol-75':'searchcar-layout'" style="display: flex;">
			<label style="margin-right: auto; margin-top: auto; margin-bottom: auto;">
				<input
				type="checkbox"
				v-model="diffPlace"
				>
				จุดรับรถและส่งรถต่างกัน
			</label>
			<button @click="search" class="button">ค้นหา</button>
		</div>
	</CardContainer>
</template>