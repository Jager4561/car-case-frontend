<script setup lang="ts">
import { ArchiveBoxXMarkIcon, InformationCircleIcon, XMarkIcon, IdentificationIcon } from '@heroicons/vue/24/solid';

definePageMeta({
  middleware: ['auth'],
});

useSeoMeta({
  title: 'Konto',
});

const { logoutUser } = useAuthService();
const { deleteSession, sessionData } = useAuthState();
const { account, fetchPending, fetchAccount } = useAccount();
const mobileView = ref<'content' | 'details' | 'info'>('content');
const isDesktop = ref(false);
const detailsRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);
const pageStatus = ref<'loading' | 'error' | 'loaded'>('loading');

const usernameValue = ref('');

const openAccountDetails = () => {
  mobileView.value = 'details';
};

const closeAccountDetails = () => {
  mobileView.value = 'content';
};

const openInfo = () => {
  mobileView.value = 'info';
};

const closeInfo = () => {
  mobileView.value = 'content';
};

const onResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

const clickedOutsideDetails = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'details';
  const isTarget = detailsRef.value === event.target;
  const clickedInside = detailsRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeAccountDetails();
  }
};

const clickedOutsideInfo = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'info';
  const isTarget = infoRef.value === event.target;
  const clickedInside = infoRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeInfo();
  }
};

const preparePage = () => {
  if (account.value == null) return;
  usernameValue.value = account.value.name;
};

const refreshPage = () => {
  fetchAccountData();
};

const logout = async () => {
  try {
    if (sessionData.value != null) {
      await logoutUser(sessionData.value.refresh_token);
    }
    deleteSession();
    navigateTo('/');
  } catch (error) {
    console.error(error);
    deleteSession();
    navigateTo('/');
  }
};

const fetchAccountData = async () => {
  if(fetchPending.value) return;
  if(account.value != null) {
    pageStatus.value = 'loaded';
    preparePage();
    return;
  };
  try {
    pageStatus.value = 'loading';
    await fetchAccount();
    pageStatus.value = 'loaded';
    preparePage();
  } catch (error) {
    pageStatus.value = 'error';
  }
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', clickedOutsideDetails);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
  fetchAccountData();
});

watch(account, () => {
  if(account.value != null) {
    fetchAccountData();
  }
})
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'details' || isDesktop" class="page_container__details">
        <div ref="detailsRef" class="page_container__details__wrapper drawer__wrapper">
          <AccountDetails :account="account" :status="pageStatus" />
        </div>
      </div>
    </Transition>
    <article class="content">
      <Transition name="fade" mode="out-in">
        <div v-if="pageStatus === 'loading'" class="loader-container">
          <div class="loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <span>Ładowanie zawartości...</span>
        </div>
        <div v-else-if="pageStatus === 'loaded'" class="account-content">
          <div class="account-content__container">
            <div class="account-content__header">
              <div class="title">
                Zdjęcie profilowe
              </div>
              <div class="description">
                Tutaj możesz zmienić swoje zdjęcie profilowe wyświetlane w instrukacjach i komentarzach.
              </div>
            </div>
            <div class="account-content__spacer"></div>
            <AccountAvatar :account="account" />
            <div class="account-content__spacer"></div>
            <div class="account-content__header">
              <div class="title">
                Nazwa użytkownika
              </div>
              <div class="description">
                Tutaj możesz zmienić swoją nazwę użytkownika.
              </div>
            </div>
            <div class="account-content__spacer"></div>
            <AccountUsername :account="account" />
            <div class="account-content__spacer"></div>
            <div class="account-content__header">
              <div class="title">
                Zmiana hasła
              </div>
              <div class="description">
                Tutaj możesz zmienić swoje hasło. Jeśli zmieniłeś hasło w ciągu 24 godzin musisz odczekać 24 godziny zanim będziesz mógł zmienić hasło ponownie.
              </div>
            </div>
            <div class="account-content__spacer"></div>
            <AccountPassword :account="account" />
          </div>
        </div>
        <div v-else class="page-error">
          <div class="page-error__container">
            <div class="page-error__header">
              <ArchiveBoxXMarkIcon class="icon" />
              <span>Wystąpił błąd</span>
            </div>
            <div class="page-error__description">Nie udało się załadować danych konta, spróbuj ponownie później.</div>
            <div class="page-error__actions">
              <NuxtLink to="/" class="text-button text-button__medium text-button__secondary">
                <span>Strona główna</span>
              </NuxtLink>
              <button class="text-button text-button__medium text-button__primary" @click="refreshPage()">
                <span>Odśwież</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </article>
    <Transition name="drawer-right">
      <aside v-show="mobileView === 'info' || isDesktop" class="right_bar">
        <div ref="infoRef" class="right_bar__wrapper drawer__wrapper">
          <RightSideBar />
        </div>
      </aside>
    </Transition>
    <div ref="footerRef" class="footer">
      <div class="start">
        <Transition name="swipe-right" mode="out-in">
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openAccountDetails()">
            <IdentificationIcon class="button-icon" />
            <span>Szczegóły</span>
          </button>
          <button v-else-if="mobileView === 'details'" class="text-button text-button__large text-button__secondary" @click="closeAccountDetails()">
            <XMarkIcon class="button-icon" />
            <span>Zamknij</span>
          </button>
        </Transition>
      </div>
      <div class="end">
        <Transition name="swipe-left" mode="out-in">
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openInfo()">
            <InformationCircleIcon class="button-icon" />
            <span>Info</span>
          </button>
          <button v-else-if="mobileView === 'info'" class="text-button text-button__large text-button__secondary" @click="closeInfo()">
            <XMarkIcon class="button-icon" />
            <span>Zamknij</span>
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_container {
  @apply w-full h-auto flex items-start pb-[72px];
  @apply lg:pb-0;

  &__details {
    @apply fixed bottom-[72px] left-0 bg-zinc-900 bg-opacity-50 w-full h-full z-20;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:left-0 lg:border-r lg:border-r-zinc-700 lg:max-w-xs;

    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-start bg-zinc-900;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }
  }

  .content {
    @apply w-full h-auto p-4;
    @apply lg:p-6;

    .loader-container {
      @apply w-full h-full flex flex-col space-y-3 items-center justify-center;
      height: calc(100vh - 5rem - theme('spacing.8'));

      @screen lg {
        height: calc(100vh - 5rem - theme('spacing.12'));
      }

      span {
        @apply text-sm font-light text-neutral-400;
      }
    }

    .account-content {
      @apply w-full h-auto;

      &__container {
        @apply w-full h-auto max-w-screen-lg mx-auto;
      }

      &__header {
        @apply w-full h-auto;

        .title {
          @apply font-semibold mb-1;
        }

        .description {
          @apply text-sm font-light;
        }
      }

      &__spacer {
        @apply w-full h-px rounded-full bg-zinc-600 my-6;
      }
    }

    .page-error {
      @apply w-full p-4 flex items-center justify-center;
      @apply lg:p-6;
      height: calc(100vh - 5rem - 72px);

      &__container {
        @apply w-auto max-w-md h-auto rounded-lg bg-zinc-900 p-6;
      }

      &__header {
        @apply w-auto h-auto flex items-center space-x-2 text-red-600 mb-4;

        .icon {
          @apply w-8 h-8;
        }

        span {
          @apply text-lg font-bold;
        }
      }

      &__description {
        @apply font-light text-sm mb-6;
      }

      &__actions {
        @apply w-full h-auto flex items-center justify-end space-x-2;
      }
    }
  }

  .right_bar {
    @apply fixed bottom-[72px] right-0 bg-zinc-900 bg-opacity-50 w-full h-full flex justify-end;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:bottom-auto lg:bg-transparent lg:max-w-xs;
    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-end bg-zinc-800;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }
  }

  .footer {
    @apply fixed bottom-0 left-0 w-full h-[72px] bg-zinc-900 flex items-center justify-between border-t border-t-zinc-700 px-4 py-3 z-40;
    @apply lg:hidden;
  }
}
</style>
