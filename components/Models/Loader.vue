<script setup lang="ts"></script>

<template>
  <div class="loader-container">
    <div class="box">
      <div class="image add-shadow"></div>
      <div class="content">
        <div class="title add-shadow"></div>
        <div class="brand">
          <div class="brand__logo add-shadow"></div>
          <div class="brand__name add-shadow"></div>
        </div>
        <div class="fuels">
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
        </div>
        <div class="hulls add-shadow"></div>
      </div>
    </div>
    <div class="box">
      <div class="image add-shadow"></div>
      <div class="content">
        <div class="title add-shadow"></div>
        <div class="brand">
          <div class="brand__logo add-shadow"></div>
          <div class="brand__name add-shadow"></div>
        </div>
        <div class="fuels">
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
        </div>
        <div class="hulls add-shadow"></div>
      </div>
    </div>
    <div class="box">
      <div class="image add-shadow"></div>
      <div class="content">
        <div class="title add-shadow"></div>
        <div class="brand">
          <div class="brand__logo add-shadow"></div>
          <div class="brand__name add-shadow"></div>
        </div>
        <div class="fuels">
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
          <div class="fuels__mark add-shadow"></div>
        </div>
        <div class="hulls add-shadow"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader-container {
  @apply w-full h-auto grid grid-cols-1 gap-3 p-4 pb-24;
  @apply sm:grid-cols-2;
  @apply md:grid-cols-3;
  @apply lg:grid-cols-2 lg:p-6;
  @apply xl:grid-cols-3;
  @apply 3xl:grid-cols-4;

  .box {
    @apply w-full h-auto bg-zinc-900 rounded-lg p-3;

    .image {
      @apply w-full h-auto bg-zinc-800 rounded-lg mb-3 relative overflow-hidden;
      aspect-ratio: 16/9;

      @screen sm {
        aspect-ratio: 3/2;
      }
    }

    .content {
      @apply w-full h-auto flex flex-col justify-between;

      .title {
        @apply w-2/3 h-6 rounded-lg bg-zinc-800 mb-2;
      }

      .brand {
        @apply flex items-center space-x-2 mb-2;

        &__logo {
          @apply w-6 h-6 rounded-lg bg-zinc-800;
        }

        &__name {
          @apply w-1/3 h-6 rounded-lg bg-zinc-800;
        }
      }

      .fuels {
        @apply w-full h-auto flex items-center space-x-2 mb-2;

        &__mark {
          @apply w-12 h-5 rounded-lg bg-zinc-800;
        }
      }

      .hulls {
        @apply w-full h-4 flex items-center bg-zinc-800 rounded-lg space-x-2;
      }
    }
  }
}
</style>
