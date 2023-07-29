<script setup lang="ts">
	import { RectangleStackIcon } from '@heroicons/vue/24/outline';
    import { StarIcon } from '@heroicons/vue/24/solid';
</script>

<template>
	<div class="layout_container">
		<HeaderBar />
		<main class="content_container">
			<slot></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
.layout_container {
	@apply w-full h-auto;

	.content_container {
		@apply w-full h-auto mx-auto flex items-start;
		padding-top: theme('spacing.20');
	}
}
</style>
