import { computed } from 'vue'

export default {
	methods: {
		getModelWrapper(name = 'modelValue') {
			return computed({
				get: () => this.$props[name],
				set: (value) => this.$emit(`update:${name}`, value),
			})
		},
	},
}
