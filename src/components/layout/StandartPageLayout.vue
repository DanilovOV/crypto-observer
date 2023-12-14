<template>
	<Wrapper>
		<Header />
		<slot></slot>
		<Footer />
	</Wrapper>
</template>

<script>
import Wrapper from '@/components/layout/components/Wrapper.vue'
import Header from '@/components/layout/components/Header.vue'
import Footer from '@/components/layout/components/Footer.vue'

export default {
	components: {
		Wrapper,
		Header,
		Footer,
	},
}
</script>

<style></style>
