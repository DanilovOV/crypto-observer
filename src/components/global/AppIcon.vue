<template>
	<component
		:is="icon"
		:class="[fill ? 'fill' : 'stroke', 'svg']"
		:style="{ width, height }"
	/>
</template>

<script>
import { markRaw } from 'vue'

export default {
	props: {
		name: {
			type: String,
			required: true,
		},
		fill: {
			type: Boolean,
		},
		width: {
			type: Number,
			default: 20,
		},
		height: {
			type: Number,
			default: 20,
		},
	},

	data() {
		return {
			icon: null,
		}
	},

	created() {
		import(`@/components/icons/Icon${this.name}.vue`).then((component) => {
			this.icon = markRaw(component.default)
		})
	},
}
</script>

<style lang="scss" scoped>
.svg {
	&.fill {
		fill: currentColor;
	}

	&.stroke {
		stroke: currentColor;
	}
}
</style>
