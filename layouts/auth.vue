<script setup lang="ts">

const currentYear = new Date().getFullYear();
</script>

<template>
	<div class="layout_container">
		<div class="content">
      <div class="content__container">
        <slot />
      </div>
      <p class="content__copyright">
        Copyright &copy; {{ currentYear }} - Wojciech Cyrwus
      </p>
		</div>
		<div class="wallpaper">
      <NuxtImg class="wallpaper-image" src="img/auth_wallpaper.jpg"></NuxtImg>
      <p class="copyright">
        Copyright &copy; {{ currentYear }} - Wojciech Cyrwus
      </p>
    </div>
	</div>
</template>

<style scoped lang="scss">
.layout_container {
	@apply w-full h-screen flex relative;

	.content {
		@apply w-full flex-shrink-0 h-full bg-zinc-900 flex flex-col overflow-y-auto;
    @apply md:w-1/2;
    @apply lg:w-1/3;

    &__container {
      @apply w-full h-auto flex-grow;
    }

    &__copyright {
      @apply flex-shrink-0 w-full text-center text-xs font-extralight h-auto text-zinc-400 pointer-events-none p-4;
      @apply md:hidden;
    }
	}

  .wallpaper {
    @apply flex-grow h-full relative ;

    .wallpaper-image {
      @apply w-full h-full object-center object-cover filter brightness-75;
    }

    .copyright {
      @apply hidden absolute bottom-3 right-4 text-center text-xs font-extralight w-auto h-auto text-white pointer-events-none;
      @apply sm:w-auto sm:pointer-events-auto sm:right-4 sm:transform-none sm:text-left;
      @apply md:block;
    }
  }
}
</style>
