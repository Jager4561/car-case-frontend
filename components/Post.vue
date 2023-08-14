<script setup lang="ts">
  import { CalendarIcon, PencilSquareIcon, HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <div class="post_container">
    <div class="post_header">
      <div class="title">Instrukcja wymiany wysprzęglika</div>
      <div class="publish_info">
        <div class="created">
          <CalendarIcon class="icon" />
          <span>45 min temu</span>
        </div>
        <div class="modified">
          <PencilSquareIcon class="icon" />
          <span>22 min temu</span>
        </div>
      </div>
    </div>
    <div class="short_description">
      <p>Wiem, jako mechanik, że wielu ludzi próbowało wymieniać wysprzęglik w golfie IV i mieli z tym duży problem, dlatego umieszczam szczegółową instrukcję wymiany tej części samochodu.</p>
    </div>
    <div class="spacer"></div>
    <div class="post_footer">
      <div class="post_info">
        <button class="model">
          <NuxtImg class="model_image" src="img/golf.jpg"></NuxtImg>
          <div class="fuel_mark">Pb95</div>
          <span class="model_name">Volkswagen Golf IV (1.6l)</span>
        </button>
        <button class="author">
          <NuxtImg class="author_image" src="img/revenant.png"></NuxtImg>
          <span class="author_name">Jan Kowalski</span>
        </button>
      </div>
      <div class="post_actions">
        <button class="author">
          <NuxtImg class="author_image" src="img/revenant.png"></NuxtImg>
          <span class="author_name">Jan Kowalski</span>
        </button>
        <div class="actions">
          <button class="icon_button">
            <HandThumbUpIcon class="icon" />
            <span class="value">234</span>
          </button>
          <button class="icon_button">
            <HandThumbDownIcon class="icon" />
            <span class="value">43</span>
          </button>
          <button class="icon_button">
            <ChatBubbleLeftRightIcon class="icon" />
            <span class="value">21</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post_container {
  @apply w-full h-auto bg-zinc-900 rounded-lg p-4 mb-6;

  .post_header {
    @apply w-full h-auto flex flex-col items-start justify-between space-y-2 mb-4;
    @apply sm:flex-row sm:space-x-4 sm:space-y-0;

    .title {
      @apply font-bold flex-grow text-lg;
    }

    .publish_info {
      @apply w-auto h-auto flex items-center space-x-2;

      .created,
      .modified {
        @apply w-auto h-auto flex items-center space-x-2 text-zinc-400;

        svg {
          @apply w-4 h-4;
        }

        span {
          @apply text-xs font-normal;
        }
      }
    }
  }

  .short_description {
    @apply w-full h-auto text-sm;
  }

  .spacer {
    @apply w-full h-0.5 bg-zinc-600 my-4;
  }

  .post_footer {
    @apply w-full h-auto flex flex-col items-start justify-between;
    @apply sm:flex-row;
    @apply lg:flex-col;
    @apply xl:flex-row;

    .post_info {
      @apply w-auto h-auto flex items-center space-x-2 mb-4;
      @apply sm:mb-0;
      @apply lg:mb-4;
      @apply xl:mb-0;

      .model {
        @apply w-auto h-auto flex items-center space-x-2 rounded-lg duration-150 pr-2;
        @apply hover:bg-zinc-800 hover:text-white;

        .model_image {
          @apply w-8 h-8 rounded-lg flex-shrink-0 object-center object-cover;
        }

        .fuel_mark {
          @apply w-auto h-auto rounded-md text-2xs font-semibold text-white bg-green-700 px-1 py-0.5;
        }

        .model_name {
          @apply text-xs text-left font-bold whitespace-nowrap;
        }
      }

      .author {
        @apply hidden sm:flex;
        @apply lg:hidden;
        @apply xl:flex;
      }
    }

    .post_actions {
      @apply w-full h-auto flex items-center justify-between space-x-1;
      @apply sm:w-auto sm:justify-end;
      @apply lg:w-full lg:justify-between;
      @apply xl:w-auto xl:justify-end;

      .author {
        @apply sm:hidden;
        @apply lg:flex;
        @apply xl:hidden;
      }

      .actions {
        @apply w-auto h-auto flex items-center space-x-1;

        .icon_button {
          @apply w-auto h-auto flex items-center space-x-1 p-1.5 rounded-lg text-gray-400 duration-150;
          @apply hover:bg-zinc-800 hover:text-white;

          .icon {
            @apply w-5 h-5;
          }

          .value {
            @apply text-sm font-medium;
          }
        }
      }
    }
    .author {
      @apply w-auto h-auto flex items-center space-x-2 rounded-full duration-150 pr-2;
      @apply hover:bg-zinc-800 hover:text-white;

      .author_image {
        @apply w-8 h-8 rounded-full flex-shrink-0 object-center object-cover;
      }
      
      .author_name {
        @apply text-xs font-bold text-left whitespace-nowrap;
      }
    }
  }
}
</style>
