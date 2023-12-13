<template>
	<Header />
	<main-page />
</template>

<script>
import MainPage from './views/MainPage.vue'
import Header from './components/layout/Header.vue'

export default {
	components: {
		MainPage,
		Header,
	},
}
</script>

<style src="./app.css"></style>
