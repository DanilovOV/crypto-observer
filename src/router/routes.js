export default [
	{
		path: '/',
		name: 'Default',
		component: () => import('@/layouts/DefaultLayout.vue'),
		children: [
			{
				path: '',
				name: 'Home',
				component: () => import('@/views/HomePage.vue'),
			},
			{
				path: 'about',
				name: 'About',
				component: () => import('@/views/AboutPage.vue'),
			},
		],
	},
]
