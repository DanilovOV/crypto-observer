<template>
	<header class="site-header">
		<div class="logo flex items-center">
			<img
				src="/icons/favicon-48x48.png"
				alt="Crypto observer"
			/>
			<div>Crypto-Observer</div>
		</div>
	</header>
</template>

<style scoped>
.site-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	background-color: #f0f0f0;
}

.logo img {
	max-height: 50px;
}

.main-menu ul {
	list-style-type: none;
	display: flex;
	gap: 20px;
}

.main-menu li {
	font-size: 16px;
}

.search-bar {
	display: flex;
	gap: 10px;
}

.search-bar input {
	padding: 8px;
	font-size: 14px;
}

.search-bar button {
	padding: 8px;
	font-size: 14px;
	cursor: pointer;
}
</style>
