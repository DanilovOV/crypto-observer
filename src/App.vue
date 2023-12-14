<template>
	<router-view></router-view>
</template>

<script>
import MainPage from './views/MainPage.vue'

export default {
	components: {
		MainPage,
	},
}
</script>

<style lang="scss">
@import '@/styles/tailwind.scss';
</style>
