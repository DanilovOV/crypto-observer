<template>
	<label :class="['block', $props.class]">
		<span class="block text-sm font-medium text-gray-700">{{ label }}</span>
		<input
			ref="input"
			v-bind="$attrs"
			v-model="model"
			:class="{ 'mt-1': $props.label }"
			class="block w-full shadow-md pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
		/>
	</label>
</template>

<script>
import defineModel from '@/mixins/defineModel'

export default {
	inheritAttrs: false,

	props: {
		class: {
			type: String,
		},
		label: {
			type: String,
		},
		modelValue: {
			type: String,
		},
	},

	mixins: [defineModel],

	data() {
		return {
			model: this.defineModel(),
		}
	},
}
</script>
