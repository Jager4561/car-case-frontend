// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		layoutTransition: { name: 'layout', mode: 'out-in' },
		pageTransition: {  name: 'page', mode: 'out-in' },
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	modules: [
		'@nuxt/image-edge',
	],
	image: {
		dir: 'public/img',
	},
    css: ['@/assets/css/main.scss', '@/assets/css/fonts.scss', '@/assets/css/inputs.scss', '@/assets/css/animations.scss'],
});
