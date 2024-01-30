<script setup lang="ts">
import { ArchiveBoxXMarkIcon, InformationCircleIcon, XMarkIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, FlagIcon } from '@heroicons/vue/24/solid';
import { IconFileDescription } from '@tabler/icons-vue';
import TextSection from '@/components/Post/TextSection.vue';
import ImageSection from '@/components/Post/ImageSection.vue';

const { isLoggedIn } = useAuthState();
const mobileView = ref<'content' | 'about' | 'info'>('content');
const isDesktop = ref(false);

const route = useRoute();
const { account } = useAccount();
const { postsWithContent, fetchPost } = usePostsState();
const { showPopup } = usePopups();
const pageStatus = ref<'loading' | 'error' | 'success'>('loading');
const post = ref<Post | null>(null);

const optionsVisible = ref(false);
const optionsButton = ref<HTMLButtonElement | null>(null);
const optionsList = ref<HTMLDivElement | null>(null);

const openPostInfo = () => {
  mobileView.value = 'about';
};

const closePostInfo = () => {
  mobileView.value = 'content';
};

const openInfo = () => {
  mobileView.value = 'info';
};

const closeInfo = () => {
  mobileView.value = 'content';
};

const toggleOptions = () => {
  optionsVisible.value = !optionsVisible.value;
};

const clickedOutside = (event: MouseEvent) => {
  if(!optionsVisible.value) return;
  const isTarget = optionsButton.value === event.target;
  const clickedInside = optionsButton.value?.contains(event.target as Node);

  if(!isTarget && !clickedInside) {
    optionsVisible.value = false;
  }
}

const sections = computed(() => {
  if (post.value && post.value.content) {
    return post.value.content.map((section: any) => {
      switch (section.type) {
        case 'text':
          return {
            component: TextSection,
            data: section,
          };
        case 'image': {
          return {
            component: ImageSection,
            data: section,
          };
        }
      }
    });
  }
  return [];
});

const loadPost = async () => {
  try {
    const wantedPost = postsWithContent.value.find((post) => post.id === +route.params.id);
    if (wantedPost) {
      post.value = wantedPost;
      pageStatus.value = 'success';
      useSeoMeta({
        title: post.value.title,
      });
      return;
    }
    const fetchedPost = await fetchPost(+route.params.id);
    if (fetchedPost) {
      post.value = fetchedPost;
      pageStatus.value = 'success';
      useSeoMeta({
        title: post.value.title,
      });
      return;
    }
  } catch (error) {
    pageStatus.value = 'error';
    useSeoMeta({
      title: 'Nie znaleziono instrukcji',
    });
  }
};

const refreshPage = () => {
  pageStatus.value = 'loading';
  loadPost();
};

const editPost = () => {
  navigateTo('/edytor/' + post.value?.id);
};

const reportPost = () => {
  showPopup('reportPost', {
    postId: post.value?.id,
  });
};

const removePost = () => {
  showPopup('deletePostConfirm', {
    postId: post.value?.id,
  });
};

const onResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  loadPost();
  document.addEventListener('click', clickedOutside);
  window.addEventListener('resize', onResize);
  onResize();
});

watch(
  postsWithContent,
  () => {
    loadPost();
  },
  { deep: true }
);
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'about' || isDesktop" class="page_container__vehicle-info">
        <div ref="vehicleInfoRef" class="page_container__vehicle-info__wrapper drawer__wrapper">
          <PostInfo :post="post" :status="pageStatus" />
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
        <div v-else-if="pageStatus === 'success'" class="post-content">
          <div class="post-content__header">
            <div class="title">
              {{ post.title }}
            </div>
            <div class="actions">
              <div class="options">
                <button ref="optionsButton" class="icon-button icon-button__secondary icon-button__small" title="Opcje" @click="toggleOptions()">
                  <EllipsisVerticalIcon class="button-icon"></EllipsisVerticalIcon>
                </button>
                <Transition name="list">
                  <div v-show="optionsVisible" ref="optionsList" class="comment-options">
                    <button v-if="isLoggedIn && account && post.author && post.author.id === account.id" class="option" @click="editPost()">
                      <PencilIcon class="option-icon"></PencilIcon>
                      <span>Edytuj</span>
                    </button>
                    <button v-if="isLoggedIn && account && post.author && post.author.id === account.id" class="option destructive" @click="removePost()">
                      <TrashIcon class="option-icon"></TrashIcon>
                      <span>Usuń</span>
                    </button>
                    <button v-if="!isLoggedIn || !account || !post.author || post.author.id != account.id" class="option" @click="reportPost()">
                      <FlagIcon class="option-icon"></FlagIcon>
                      <span>Zgłoś</span>
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <div class="post-content__abstract">
            {{ post.abstract }}
          </div>
          <div class="post-content__container">
            <component v-for="section in sections" :is="section.component" :data="section.data"></component>
          </div>
          <div class="post-content__spacer"></div>
          <div id="comments" class="post-content__comments">
            <div class="title">Komentarze do instrukcji</div>
            <div v-if="post.comments.length === 0" class="no-comments">Brak komentarzy</div>
            <CommonComment v-for="comment in post.comments" :comment="comment" :postId="post.id" />
            <div v-if="!isLoggedIn" class="see-more-comments">
              <div class="login-note">
                <p><NuxtLink to="/zaloguj">Zaloguj się </NuxtLink> lub <NuxtLink to="/zarejestruj">zarejestruj</NuxtLink> aby dodać komentarz.</p>
              </div>
            </div>
            <div v-if="isLoggedIn" class="write">
              <CommonWriteComment :postId="post.id" :closeActive="false" />
            </div>
          </div>
        </div>
        <div v-else class="page-error">
          <div class="page-error__container">
            <div class="page-error__header">
              <ArchiveBoxXMarkIcon class="icon" />
              <span>Wystąpił błąd</span>
            </div>
            <div class="page-error__description">Nie udało się załadować danych instrukcji, odśwież stronę lub wróć na stronę główną.</div>
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
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openPostInfo()">
            <IconFileDescription class="button-icon" />
            <span>Szczegóły</span>
          </button>
          <button v-else-if="mobileView === 'about'" class="text-button text-button__large text-button__secondary" @click="closePostInfo()">
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

  &__vehicle-info {
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

    .page-empty {
      @apply w-full h-auto min-h-full p-4 flex items-center justify-center;
      @apply lg:p-6;
      height: calc(100vh - 5rem - 72px);

      &__container {
        @apply w-auto max-w-md h-auto rounded-lg bg-zinc-900 p-6;
      }

      &__header {
        @apply w-auto h-auto flex items-center space-x-2 text-zinc-400 mb-4;

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

    .post-content {
      @apply w-full h-auto;

      &__header {
        @apply w-full h-auto flex flex-col items-end justify-center mb-3;
        @apply md:flex-row md:items-center md:justify-between;
        @apply lg:flex-col lg:items-end lg:justify-center;
        @apply xl:flex-row xl:items-center xl:justify-between;

        .title {
          @apply w-full text-xl font-bold mb-1;
          @apply md:w-auto md:mb-0;
          @apply lg:w-full lg:mb-1;
          @apply xl:w-auto xl:mb-0;
        }

        .options {
          @apply order-2 flex-shrink-0 w-6 h-auto relative;
          @apply sm:order-none;

          .icon-button {
            @apply w-8 h-8 rounded-md;

            .button-icon {
              @apply w-5 h-5;
            }
          }

          .comment-options {
            @apply absolute top-full right-0 mt-1;
            @apply w-56 h-auto rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 mt-1;
            transform-origin: top;

            .option {
              @apply w-full h-auto p-2 text-xs text-left flex items-center space-x-2 duration-200 hover:bg-zinc-700;

              .option-icon {
                @apply w-5 h-5 text-zinc-400;
              }

              &.destructive {
                @apply text-red-600;

                .option-icon {
                  @apply text-red-600;
                }
              }
            }

            .option:disabled {
              @apply pointer-events-none opacity-50;
            }
          }
        }
      }

      &__abstract {
        @apply w-full h-auto text-sm text-zinc-300 p-3 rounded-lg border border-zinc-600 mb-6;
      }

      &__container {
        @apply w-full h-auto max-w-screen-md mx-auto;
      }

      &__spacer {
        @apply w-full h-0.5 max-w-screen-md mx-auto rounded-full bg-zinc-600 mb-6;
      }

      &__comments {
        @apply w-full h-auto max-w-screen-md mx-auto;

        .title {
          @apply text-lg mb-6;
        }

        .no-comments {
          @apply w-full h-auto font-bold text-sm text-zinc-400 text-center pb-6;
        }

        .see-more-comments {
          @apply w-full h-auto flex items-center justify-start mb-2;

          .login-note {
            @apply w-auto h-auto text-xs text-zinc-400;

            a {
              @apply text-zinc-200 duration-200 hover:text-darkCyan cursor-pointer;
            }
          }
        }

        .write {
          @apply w-full h-auto;
        }
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
