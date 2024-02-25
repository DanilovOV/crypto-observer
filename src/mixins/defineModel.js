import { computed } from 'vue'

export default {
	methods: {
		defineModel(name = 'modelValue') {
			return computed({
				get: () => this.$props[name],
				set: (value) => this.$emit(`update:${name}`, value),
			})
		},
	},
}
