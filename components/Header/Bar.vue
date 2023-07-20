<script setup lang="ts">
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const mobileMenuOpen = ref(false);
const filtersOpen = ref(false);
const notificationsOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value;
};

const notificationsButton = ref<HTMLButtonElement | null>(null);
const notificationsModal = ref<HTMLDivElement | null>(null);
const isClickedOutsideNotifications = (event: MouseEvent) => {
  if (notificationsOpen.value && notificationsButton.value && notificationsModal.value) {
    if (
      !notificationsButton.value.contains(event.target as Node) &&
      !notificationsModal.value.contains(event.target as Node) &&
      event.target !== notificationsButton.value &&
      event.target !== notificationsModal.value
    ) {
      notificationsOpen.value = false;
    }
  }
};

onMounted(() => {
  window.addEventListener('click', isClickedOutsideNotifications);
});

watch(route, () => {
  mobileMenuOpen.value = false;
});
</script>

<template>
  <header>
    <div class="header_container">
      <div class="mobile_menu">
        <button class="icon_button" @click="toggleMobileMenu" title="Otwórz/Zamknij menu">
          <Transition name="fast-fade" mode="out-in">
            <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </Transition>
        </button>
      </div>
      <div class="logo">
        <NuxtLink to="/">
          <h1><span class="highlight">CAR</span>CASE</h1>
        </NuxtLink>
      </div>
      <div class="search_and_filters">
        <div class="input_container">
          <MagnifyingGlassIcon class="w-6 h-6 icon" />
          <input type="text" placeholder="Szukaj..." />
        </div>
        <button class="icon_button" :class="{active: filtersOpen}">
          <AdjustmentsHorizontalIcon class="w-6 h-6" />
        </button>
        <div class="filters-modal">
          <HeaderFilters />
        </div>
      </div>
      <div class="account">
        <NuxtLink v-if="false" to="/zaloguj" class="primary_button">
          <span>Zaloguj się</span>
        </NuxtLink>
        <NuxtLink v-if="false" to="/zaloguj" class="icon_button">
          <ArrowRightOnRectangleIcon class="w-6 h-6 icon" />
        </NuxtLink>
        <template v-if="true">
          <button ref="notificationsButton" aria-label="Powiadomienia" class="notifications icon_button" :class="{active: notificationsOpen}" @click="toggleNotifications()">
            <BellIcon class="w-6 h-6" />
            <span class="mark"></span>
          </button>
          <button aria-label="Profil" class="profile">
            <NuxtImg src="revenant.png"></NuxtImg>
            <div class="username">
              <span>Jager456</span>
            </div>
          </button>
          <div ref="notificationsModal" class="notifications_modal">
            <HeaderNotifications v-model="notificationsOpen" />
          </div>
        </template>
      </div>
    </div>
    <div class="search_filters">
      <MagnifyingGlassIcon class="w-6 h-6 icon" />
      <input class="search_input" type="text" placeholder="Szukaj..." />
      <button class="icon_button">
        <AdjustmentsHorizontalIcon class="w-6 h-6" />
      </button>
    </div>
    <Transition name="menu">
      <div v-if="mobileMenuOpen" class="mobile_menu_container">
        <SideNav />
      </div>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
header {
  @apply fixed top-0 left-0 w-full h-20 bg-zinc-900 z-50;
  @apply lg:h-24;

  .header_container {
    @apply w-full h-full max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4;

    .mobile_menu {
      @apply w-1/4 h-auto;
      @apply lg:hidden;
    }

    .logo {
      @apply w-2/4 h-auto flex items-center justify-center;
      @apply lg:justify-start lg:w-1/4;

      h1 {
        @apply text-2xl font-black leading-5;

        .highlight {
          @apply text-darkCyan;
        }
      }
    }

    .search_and_filters {
      @apply hidden w-1/2 h-auto items-center space-x-2 relative;
      @apply lg:flex;
      .input_container {
        @apply flex-grow w-full h-auto relative;

        .icon {
          @apply absolute top-2 left-2 text-zinc-400 z-10;
        }

        input {
          @apply w-full h-10 bg-zinc-800 rounded-md pl-10 pr-4 text-sm font-semibold;
          @apply focus:outline-none focus:ring-0;
        }
      }

      .icon_button {
        @apply w-10 h-10 flex-shrink-0 rounded-md flex items-center justify-center text-gray-400 duration-150;
        @apply hover:bg-zinc-700 hover:text-white;
      }

      .icon_button.active {
        @apply bg-zinc-700 text-white;
      }

      .filters-modal {
        @apply fixed top-32 right-0 w-full h-[calc(100vh-8rem)] z-50;
        @apply lg:absolute lg:top-24 lg:right-0 lg:w-full lg:h-auto;
      }
    }

    .account {
      @apply w-1/4 h-auto flex items-center justify-end space-x-2 relative;

      .primary_button {
        @apply hidden w-auto h-auto items-center space-x-2 text-white bg-darkCyan rounded-md px-6 py-2 text-sm font-semibold duration-150;
        @apply hover:filter hover:brightness-110;
        @apply lg:flex;

        .icon {
          @apply w-4 h-4;
        }
      }

      .notifications {
        @apply flex relative;

        .mark {
          @apply absolute w-2 h-2 bg-red-600 bottom-2 right-2 rounded-full;
        }
      }

      .notifications.active {
        @apply bg-zinc-700 text-white;
      }

      .profile {
        @apply w-auto h-10 rounded-full flex items-center justify-center relative overflow-hidden duration-300;
        @apply hover:bg-zinc-700;

        img {
          @apply w-10 h-10 rounded-full object-cover object-center;
        }

        .username {
          @apply max-w-0 block text-sm text-zinc-200 duration-300;
        }
      }

      @screen lg {
        .profile:hover {
          .username {
            @apply max-w-[6rem];

            span {
              @apply block w-auto h-auto pl-2 pr-3;
            }
          }
        }
      }

      .notifications_modal {
        @apply fixed top-20 right-0 w-full h-[calc(100vh-5rem)] z-50;
        @apply lg:absolute lg:top-20 lg:right-0 lg:w-96 lg:h-auto;
      }
    }

    .icon_button {
      @apply w-10 h-10 flex-shrink-0 rounded-md flex items-center justify-center text-gray-400 duration-150;
      @apply lg:hover:bg-zinc-700 lg:hover:text-white lg:hidden;
    }
  }

  .search_filters {
    @apply w-full h-12 bg-zinc-700 flex items-center relative;
    @apply lg:hidden;

    .search_input {
      width: calc(100% - theme('spacing.14'));
      @apply h-12 bg-zinc-700 pl-14 text-sm font-semibold;
      @apply focus:outline-none focus:ring-0;
    }

    .icon {
      @apply absolute top-3 left-6 text-zinc-400 z-10;
    }

    .icon_button {
      @apply w-10 h-10 flex-shrink-0 rounded-md flex items-center justify-center mr-6 ml-2 my-2 text-gray-400 duration-150;
    }
  }

  .mobile_menu_container {
    height: calc(100vh - theme('spacing.20'));
    @apply fixed bottom-0 left-0 w-full z-[100] bg-zinc-800;
    @apply lg:hidden;
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
