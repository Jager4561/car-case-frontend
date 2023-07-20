<script setup lang="ts">
	import { RectangleStackIcon } from '@heroicons/vue/24/outline';
    import { StarIcon } from '@heroicons/vue/24/solid';
</script>

<template>
	<div class="layout_container">
		<HeaderBar />
		<div class="content_container">
			<aside class="left_sidebar">
				<SideNav />
			</aside>
			<main class="content">
				<div class="tabs">
					<button class="tab_button active">
						<RectangleStackIcon class="w-5 h-5" />
						<span>Tablica</span>
					</button>
					<button class="tab_button">
						<StarIcon class="w-5 h-5" />
						<span>Najpopularniejsze</span>
					</button>
				</div>
				<slot />
			</main>
			<aside class="right_sidebar">
				<RightSideBar />
			</aside>
		</div>
	</div>
</template>

<style scoped lang="scss">
.layout_container {
	@apply w-full h-auto;

	.content_container {
        
		@apply w-full h-auto max-w-screen-xl mx-auto flex items-start;
		padding-top: theme('spacing.32');
		
		@screen lg {
			padding-top: theme('spacing.24');
		}

		.left_sidebar {
			@apply hidden w-1/4 sticky top-24;
            height: calc(100vh - theme('spacing.24'));
			@apply lg:block;
		}

		.content {
			@apply w-full h-full;
			@apply lg:w-1/2;

			.tabs {
				@apply w-full h-auto px-6 pt-6 flex items-center space-x-3;
				@apply lg:hidden;

				.tab_button {
					@apply w-1/2 h-auto flex items-center justify-center space-x-1 text-sm font-semibold px-3 py-2 text-white rounded-md;
				}

				.active {
					@apply bg-darkCyan;
				}
			}
		}

		.right_sidebar {
			@apply hidden w-1/4 sticky top-24;
            height: calc(100vh - theme('spacing.24'));
			@apply lg:block;
		}
	}
}
</style>
