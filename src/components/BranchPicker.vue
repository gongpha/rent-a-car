<script lang="ts">
import { defineComponent } from 'vue'
import VueMultiselect from 'vue-multiselect'
import axios from 'axios';

// allow cross domain
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default defineComponent({
	components: { VueMultiselect },
	data() {
		return {
			options: ([] as any[]),
			selected: '',
		};
	},

	created() {
		this.getBranches();
	},

	methods: {
		getBranches() {
			axios.get('http://127.0.0.1:5000/branches')
				.then(response => {
					let options : any[] = [];
					response.data.branches.forEach((branch: any) => {
						options.push({
							id: branch.branch_id,
							name: branch.branch_name,
						});
					});
					this.options = options;
				})
				.catch(error => {
					console.log(error);
				})
		}
	}
})

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
	<VueMultiselect
		:options="options"
		v-model="selected"
		label="name"
		placeholder="เลือกสถานที่"
		:show-labels="false"
	>
	</VueMultiselect>

</template>