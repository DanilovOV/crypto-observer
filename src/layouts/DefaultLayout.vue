<template>
	<WrapperComponent>
		<HeaderLayout />
		<ContentLayout>
			<RouterView />
		</ContentLayout>
		<FooterLayout />
	</WrapperComponent>
</template>

<script>
import { RouterView } from 'vue-router'
import WrapperComponent from '@/components/layout/WrapperComponent.vue'
import HeaderLayout from '@/components/layout/HeaderLayout.vue'
import FooterLayout from '@/components/layout/FooterLayout.vue'
import ContentLayout from '@/components/layout/ContentLayout.vue'
export default {
	components: {
		RouterView,
		WrapperComponent,
		HeaderLayout,
		FooterLayout,
		ContentLayout,
	},

	mounted() {
		console.log('LayoutMounted')
	},
}
</script>

<style></style>
