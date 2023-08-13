<script setup lang="ts">
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/vue/24/outline';
import { HomeIcon, SwatchIcon, ArchiveBoxIcon, ChatBubbleLeftEllipsisIcon, InformationCircleIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid';

const { isLoggedIn } = useAuthState();
const mobileMenuOpen = ref(false);
const notificationsOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
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

const mobileMenuButtonRef = ref<HTMLButtonElement | null>(null);
const mobileMenuRef = ref<HTMLDivElement | null>(null);
const isClickedOutsideMenu = (event: MouseEvent) => {
  if (mobileMenuOpen.value && mobileMenuButtonRef.value && mobileMenuRef.value) {
    if (
      !mobileMenuButtonRef.value.contains(event.target as Node) &&
      !mobileMenuRef.value.contains(event.target as Node) &&
      event.target !== mobileMenuButtonRef.value &&
      event.target !== mobileMenuRef.value
    ) {
      mobileMenuOpen.value = false;
    }
  }
};

onMounted(() => {
  window.addEventListener('click', isClickedOutsideNotifications);
  window.addEventListener('click', isClickedOutsideMenu);
});
</script>

<template>
  <header>
    <div class="start">
      <button ref="mobileMenuButtonRef" aria-label="Otwórz/Zamknij menu" class="menu-button icon-button icon-button__secondary icon-button__medium" @click="toggleMobileMenu()">
        <Transition name="fade" mode="out-in">
          <Bars3Icon v-if="!mobileMenuOpen" class="icon" />
          <XMarkIcon v-else class="icon" />
        </Transition>
      </button>
      <NuxtLink to="/" class="logo">Car<span class="highlight">Case</span></NuxtLink>
      <nav class="nav">
        <NuxtLink to="/" class="nav__link" active-class="nav__active"> Główna </NuxtLink>
        <NuxtLink to="/modele" class="nav__link" active-class="nav__active"> Modele </NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/moje-dokumentacje" class="nav__link" active-class="nav__active"> Moje dokumetacje </NuxtLink>
        <NuxtLink v-if="isLoggedIn" to="/moje-opinie" class="nav__link" active-class="nav__active"> Moje opinie </NuxtLink>
        <NuxtLink to="/o-aplikacji" class="nav__link" active-class="nav__active"> O aplikacji </NuxtLink>
      </nav>
    </div>
    <div class="end">
      <template v-if="isLoggedIn">
        <button ref="notificationsButton" aria-label="Powiadomienia" class="notifications icon_button" :class="{ active: notificationsOpen }" @click="toggleNotifications()">
          <BellIcon class="w-6 h-6" />
          <span class="mark"></span>
        </button>
        <HeaderNotifications v-model="notificationsOpen"></HeaderNotifications>
        <NuxtLink to="/konto" aria-label="Profil" class="profile" activeClass="active">
          <NuxtImg src="revenant.png"></NuxtImg>
          <div class="username">
            <span>Jager456</span>
          </div>
        </NuxtLink>
      </template>
      <template v-if="!isLoggedIn">
        <NuxtLink to="/zaloguj" class="login-desktop text-button text-button__medium text-button__primary">
          Zaloguj się
        </NuxtLink>
        <NuxtLink to="/zarejestruj" class="register-desktop text-button text-button__medium text-button__secondary">
          Zarejestruj się
        </NuxtLink>
        <NuxtLink to="/zaloguj" class="login-mobile icon-button icon-button__medium icon-button__primary">
          <ArrowRightOnRectangleIcon class="icon" />
        </NuxtLink>
        <NuxtLink to="/zarejestruj" class="register-mobile icon-button icon-button__medium icon-button__secondary">
          <UserPlusIcon class="icon" />
        </NuxtLink>
      </template>
    </div>
  </header>
  <Transition name="menu">
    <div v-show="mobileMenuOpen" class="mobile-menu">
      <div ref="mobileMenuRef" class="mobile-menu__wrapper">
        <NuxtLink to="/" class="mobile-menu__link" activeClass="mobile-menu__active" @click="closeMobileMenu()">
          <HomeIcon class="icon" />
          <span> Główna </span>
        </NuxtLink>
        <NuxtLink to="/modele" class="mobile-menu__link" activeClass="mobile-menu__active" @click="closeMobileMenu()">
          <SwatchIcon class="icon" />
          <span> Modele </span>
        </NuxtLink>
        <NuxtLink to="/moje-dokumentacje" class="mobile-menu__link" activeClass="mobile-menu__active" @click="closeMobileMenu()">
          <ArchiveBoxIcon class="icon" />
          <span> Moje dokumentacje </span>
        </NuxtLink>
        <NuxtLink to="/moje-opinie" class="mobile-menu__link" activeClass="mobile-menu__active" @click="closeMobileMenu()">
          <ChatBubbleLeftEllipsisIcon class="icon" />
          <span> Moje opinie </span>
        </NuxtLink>
        <NuxtLink to="/o-aplikacji" class="mobile-menu__link" activeClass="mobile-menu__active" @click="closeMobileMenu()">
          <InformationCircleIcon class="icon" />
          <span> O aplikacji </span>
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
header {
  @apply fixed top-0 left-0 w-full h-20 flex items-center justify-between bg-zinc-900 border-b border-b-zinc-700 z-50 px-4 py-3;
  @apply lg:h-20 md:px-6;

  .start {
    @apply w-auto flex items-center;

    .menu-button {
      @apply mr-2;
      @apply lg:hidden;

      .icon {
        @apply w-7 h-7;
      }
    }

    .logo {
      @apply text-2xl font-black leading-5 uppercase;
      @apply md:mr-10;

      .highlight {
        @apply text-darkCyan;
      }
    }

    .nav {
      @apply hidden items-center space-x-1;
      @apply lg:flex;

      &__link {
        @apply block w-auto h-auto text-sm font-light rounded-md relative duration-200 px-3 py-1.5;
        @apply hover:text-darkCyan;
      }

      &__active {
        @apply bg-zinc-800 font-normal text-darkCyan;
      }
    }
  }

  .end {
    @apply flex items-center justify-end space-x-2;

    .icon_button {
      @apply w-10 h-10 flex-shrink-0 rounded-md flex items-center justify-center text-gray-400 duration-150;
      @apply lg:hover:bg-zinc-700 lg:hover:text-white lg:hidden;
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
      @apply w-auto h-10 rounded-full flex items-center bg-zinc-800 justify-center relative overflow-hidden duration-300;

      img {
        @apply w-10 h-10 rounded-full object-cover object-center;
      }

      .username {
        @apply hidden text-sm text-zinc-200 duration-300 px-2 pr-4;
        @apply sm:block;
      }
    }

    .active {
      @apply bg-zinc-700 text-white;
    }

    .login-desktop, .register-desktop {
      @apply hidden md:flex;
    }
    .login-mobile, .register-mobile {
      @apply md:hidden;
    }
  }
}

.mobile-menu {
  height: calc(100vh - theme('spacing.20'));
  @apply fixed w-full bottom-0 left-0 z-[100] bg-zinc-900 bg-opacity-25 space-y-2 flex justify-start;
  @apply lg:hidden;

  &__wrapper {
    @apply w-full h-full bg-zinc-900 p-4 space-y-2;
    @apply sm:max-w-sm;
  }

  &__link {
    @apply w-full h-auto flex items-center space-x-3 px-4 py-4 font-semibold text-zinc-400 text-lg duration-200 rounded-lg;

    .icon {
      @apply w-7 h-7;
    }
  }
  &__active {
    @apply bg-zinc-800 text-darkCyan;
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;

  .mobile-menu__wrapper {
    transition: all 0.3s ease;
  }
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0 !important;

  .mobile-menu__wrapper {
    transform: translateX(-100%) !important;
  }
}
</style>
