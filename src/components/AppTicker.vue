<!-- Помещать компонент внутрь тега dl -->
<template>
	<div
		class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
		:class="{ 'border-4': isActive }"
	>
		<div
			class="px-4 py-5 sm:p-6 text-center"
			:class="{ 'bg-red-100': isError }"
		>
			<dt class="text-sm font-medium text-gray-500 truncate">
				{{ currency }} - USD
			</dt>
			<dd class="mt-1 text-3xl font-semibold text-gray-900">
				{{ price }}
			</dd>
		</div>
		<div class="w-full border-t border-gray-200"></div>
		<button
			class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
			@click.stop="$emit('delete')"
		>
			<AppIcon fill name="Delete" class="mr-1" />
			<span>Удалить</span>
		</button>
	</div>
</template>

<script>
import AppIcon from './global/AppIcon.vue'

export default {
	props: {
		currency: {
			type: String,
			require: true,
		},
		price: {
			type: String,
			require: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isError: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['delete'],
	components: { AppIcon },
}
</script>
