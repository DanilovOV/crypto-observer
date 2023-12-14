const routes = [
	{
		path: '/temp',
		name: 'Main',
		component: () => import('@/views/MainPage.vue'),
	},
	{
		path: '/',
		name: 'Home',
		component: () => import('@/views/HomePage.vue'),
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('@/views/AboutPage.vue'),
	},
]

export default routes
