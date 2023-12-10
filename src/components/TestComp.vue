<template>
	<input
		type="text"
		v-model="defaultModelValue"
	/>

	<input
		type="text"
		v-model="secondModelValue"
	/>
</template>

<script>
import getModelWrapper from '@/mixins/getModelWrapper'

export default {
	props: {
		modelValue: String,
		test: String,
	},

	mixins: [getModelWrapper],

	data() {
		return {
			defaultModelValue: this.getModelWrapper(),
			secondModelValue: this.getModelWrapper('test'),
		}
	},
}
</script>

<style lang="scss" scoped></style>
