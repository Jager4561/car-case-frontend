<script setup lang="ts">
import { InformationCircleIcon, XMarkIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/24/solid';
import { IconCar, IconAlphabetLatin, IconPhoto } from '@tabler/icons-vue';
import TextSection from '~/components/Editor/TextSection.vue';
import ImageSection from '~/components/Editor/ImageSection.vue';

export interface EditorForm {
  status: string;
  title: string | null;
  abstract: string | null;
  brand: number | null;
  model: number | null;
  generation: number | null;
  engine: number| null;
  hull_type: number | null;
  sections: {
    type: 'text' | 'image';
    size?: number,
    content: string | null;
    file?: File | null;
  }[];
}

export interface ModelSelect {
  status: string;
  brand: number | null;
  model: number | null;
  generation: number | null;
  engine: number | null;
  hull_type: number | null;
}

definePageMeta({
  middleware: ['auth'],
});

useSeoMeta({
  title: 'Edytor instrukcji',
});

const route = useRoute();
const router = useRouter();
const { showPopup, popupListener } = usePopups();
const { createWarningToast, createErrorToast, createSuccessToast } = useToasts();
const { fetchPost, addNewPost, editPost } = usePostsState();
const editorMode = ref<'add' | 'edit'>('add');
const mobileView = ref<'content' | 'modelSelector' | 'info'>('content');
const isDesktop = ref(false);
const modelSelectorRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);
const pageStatus = ref<'loading' | 'error' | 'loaded'>('loading');

const formPending = ref(false);
const defaultFormValues = reactive<EditorForm>({
  status: 'published',
  brand: null,
  model: null,
  generation: null,
  engine: null,
  hull_type: null,
  title: null,
  abstract: null,
  sections: [],
});
const postForm = reactive<EditorForm>({
  status: 'published',
  brand: null,
  model: null,
  generation: null,
  engine: null,
  hull_type: null,
  title: null,
  abstract: null,
  sections: [],
});

const openModelSelector = () => {
  mobileView.value = 'modelSelector';
};

const closeModelSelector = () => {
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

const clickedOutsideModelSelector = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'modelSelector';
  const isTarget = modelSelectorRef.value === event.target;
  const clickedInside = modelSelectorRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeModelSelector();
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

const initPage = async () => {
  pageStatus.value = 'loading';
  const postId = route.params.postId;
  if(postId != null && postId != '+') {
    editorMode.value = 'edit';
    try {
      const post = await fetchPost(+postId);
      if(post == null) {
        pageStatus.value = 'error';
        return;
      }
      pageStatus.value = 'loaded';
      postForm.status = defaultFormValues.status = post.status;
      postForm.title = defaultFormValues.title = post.title;
      postForm.abstract = defaultFormValues.abstract = post.abstract;
      postForm.brand = defaultFormValues.brand = post.model.brand.id;
      postForm.model = defaultFormValues.model = post.model.id;
      postForm.generation = defaultFormValues.generation = post.model.generation.id;
      postForm.engine = defaultFormValues.engine = post.model.engine.id;
      postForm.hull_type = defaultFormValues.hull_type = post.model.hull_type.id;
      if(post.content != null && post.content.length > 0) {
        defaultFormValues.sections = [];
        postForm.sections = [];
        for(let i = 0; i < post.content.length; i++) {
          const section = post.content[i];
          if(section.type === 'text') {
            postForm.sections.push({
              type: 'text',
              size: section.size,
              content: section.content,
            });
            defaultFormValues.sections.push({
              type: 'text',
              size: section.size,
              content: section.content,
            });
          } else if(section.type === 'image') {
            postForm.sections.push({
              type: 'image',
              content: section.content,
              file: null,
            });
            defaultFormValues.sections.push({
              type: 'image',
              content: section.content,
              file: null,
            });
          }
        }
      }
    } catch (error) {
      pageStatus.value = 'error';
      console.log(error);
    }
  } else {
    router.replace('/edytor/+');
    pageStatus.value = 'loaded';
    editorMode.value = 'add';
  }
}

const onModelSelectorUpdate = (value: ModelSelect) => {
  postForm.status = value.status;
  postForm.brand = value.brand;
  postForm.model = value.model;
  postForm.generation = value.generation;
  postForm.engine = value.engine;
  postForm.hull_type = value.hull_type;
};

const sectionsToDisplay = shallowRef<any[]>([]);

const generateSections = () => {
  const sections = postForm.sections.map((section) => {
    if (section.type === 'text') {
      return {
        component: TextSection,
        data: {
          type: 'text',
          size: section.size,
          content: section.content,
        },
      }
    } else if (section.type === 'image') {
      return {
        component: ImageSection,
        data: {
          type: 'image',
          content: section.content,
          file: section.file,
        },
      }
    } else {
      return null;
    }
  });
  sectionsToDisplay.value = sections;
};

const createTextSection = () => {
  postForm.sections.push({
    type: 'text',
    size: 1,
    content: '',
  });
};

const createImageSection = () => {
  postForm.sections.push({
    type: 'image',
    content: null,
    file: null
  });
};

const moveSectionUp = (index: number) => {
  if (index === 0) return;
  const arrayCopy = [...postForm.sections];
  const section = arrayCopy[index];
  arrayCopy.splice(index, 1);
  arrayCopy.splice(index - 1, 0, section);
  postForm.sections = [];
  setTimeout(() => {
    postForm.sections = arrayCopy;
  }, 0);
}

const moveSectionDown = (index: number) => {
  if (index === postForm.sections.length - 1) return;
  const arrayCopy = [...postForm.sections];
  const section = arrayCopy[index];
  arrayCopy.splice(index, 1);
  arrayCopy.splice(index + 1, 0, section);
  postForm.sections = [];
  setTimeout(() => {
    postForm.sections = arrayCopy;
  }, 0);
}

const removeSection = (index: number) => {
  postForm.sections.splice(index, 1);
}

const updateSection = (options: {
  index: number;
  data: any
}) => {
  postForm.sections[options.index] = options.data;
}

const verifyFormContent = () => {
  if(postForm.title == null || postForm.title.length < 3) {
    createWarningToast('Dodwanie instrukcji', 'Tytuł instrukcji musi zawierać co najmniej 3 znaki.');
    return false;
  }
  if(postForm.abstract == null || postForm.abstract.length < 3) {
    createWarningToast('Dodwanie instrukcji', 'Opis instrukcji musi zawierać co najmniej 3 znaki.');
    return false;
  }
  if(
    postForm.brand == null ||
    postForm.model == null ||
    postForm.generation == null ||
    postForm.engine == null ||
    postForm.hull_type == null
  ) {
    mobileView.value = 'modelSelector';
    createWarningToast('Dodwanie instrukcji', 'Musisz wybrać model pojazdu. Uzupełniaj pola dopóki nie pojawi się informacja o uzupełnieniu wzystkich danych.');
    return false;
  }
  if(postForm.sections.length === 0) {
    createWarningToast('Dodwanie instrukcji', 'Instrukcja musi zawierać co najmniej jedną sekcję.');
    return false;
  }
  return true;
}

const onAddFormSubmit = async () => {
  if(formPending.value) return;
  if(!verifyFormContent()) return;
  formPending.value = true;
  try {
    await addNewPost({
      status: postForm.status,
      title: postForm.title!,
      abstract: postForm.abstract!,
      brand: postForm.brand!,
      model: postForm.model!,
      generation: postForm.generation!,
      engine: postForm.engine!,
      hull_type: postForm.hull_type!,
      sections: postForm.sections,
    });
    createSuccessToast('Dodwanie instrukcji', 'Instrukcja została dodana.');
    leaveAfterQuestion.value = false;
    navigateTo(`/moje-dokumentacje`);
  } catch (error) {
    console.log(error);
    createErrorToast('Dodwanie instrukcji', 'Wystąpił błąd podczas dodawania instrukcji.');
  } finally {
    formPending.value = false;
  }
}

const onEditFormSubmit = async () => {
  if(formPending.value) return;
  if(!verifyFormContent()) return;
  formPending.value = true;
  try {
    await editPost(+route.params.postId, {
      status: postForm.status,
      title: postForm.title!,
      abstract: postForm.abstract!,
      brand: postForm.brand!,
      model: postForm.model!,
      generation: postForm.generation!,
      engine: postForm.engine!,
      hull_type: postForm.hull_type!,
      sections: postForm.sections,
    });
    createSuccessToast('Edycja instrukcji', 'Instrukcja została zaktualizowana.');
    leaveAfterQuestion.value = false;
    navigateTo(`/instrukcje/${route.params.postId}`);
  } catch (error) {
    console.log(error);
    createErrorToast('Edycja instrukcji', 'Wystąpił błąd podczas edycji instrukcji.');
  } finally {
    formPending.value = false;
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', clickedOutsideModelSelector);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
  initPage();
  popupListener().subscribe(value => {
    if(value == null) {
      setTimeout(() => {
        leaveAfterQuestion.value = true;
      }, 100);
    }
  });
});

const didSectionsChanged = () => {
  let hasChanged = false;
  postForm.sections.forEach((section, index) => {
    const defaultSection = defaultFormValues.sections[index];
    if(JSON.stringify(section) !== JSON.stringify(defaultSection)) {
      hasChanged = true;
    }
  });
  return hasChanged;
}

const leaveAfterQuestion = ref(true);
onBeforeRouteLeave((to) => {
  if(
    (defaultFormValues.status !== postForm.status ||
    defaultFormValues.title !== postForm.title ||
    defaultFormValues.abstract !== postForm.abstract ||
    defaultFormValues.brand !== postForm.brand ||
    defaultFormValues.model !== postForm.model ||
    defaultFormValues.generation !== postForm.generation ||
    defaultFormValues.engine !== postForm.engine ||
    defaultFormValues.hull_type !== postForm.hull_type ||
    didSectionsChanged())
    && leaveAfterQuestion.value
  ) {
    leaveAfterQuestion.value = false;
    showPopup('unsavedChanges', {
      to: to.path,
    });
    return false;
  }
});

watch(() => postForm.sections, () => {
  generateSections();
}, {
  deep: true,
  immediate: true,
});
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'modelSelector' || isDesktop" class="page_container__model-selector">
        <div ref="filtersRef" class="page_container__model-selector__wrapper drawer__wrapper">
          <EditorModelSelector :modelForm="(postForm as any)" :isError="pageStatus === 'error'" :disabled="formPending" @onUpdate="onModelSelectorUpdate" />
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
        <div v-else-if="pageStatus == 'loaded'" class="editor" :class="{disabled: formPending}">
          <div class="editor__header">
            <div class="title-input">
              <div class="field">
                <div class="field__input">
                  <label class="field__label">Tytuł instrukcji</label>
                  <input v-model="postForm.title" type="text" placeholder="Wprowadź tytuł..." />
                </div>
              </div>
            </div>
            <div class="actions">
              <button class="text-button text-button__primary text-button__medium" @click="editorMode == 'edit' ? onEditFormSubmit() : onAddFormSubmit()">
                <span v-if="!formPending">{{ editorMode == 'edit' ? 'Zapisz' : 'Utwórz' }}</span>
                <div v-if="formPending" class="loader">
                  <div class="dot"></div>
                  <div class="dot"></div>
                  <div class="dot"></div>
                </div>
              </button>
            </div>
          </div>
          <div class="editor__description">
            <div class="field">
              <div class="field__input">
                <label class="field__label">Opis instrukcji</label>
                <textarea v-model="(postForm.abstract as any)" placeholder="Wprowadź opis..."></textarea>
              </div>
            </div>
          </div>
          <div class="editor__section-title">
            Zawartość instrukcji
          </div>
          <div class="editor__sections">
            <TransitionGroup tag="div">
                <component
                  v-for="(section, index) in sectionsToDisplay"
                  :key="index"
                  :is="section!.component"
                  :data="section!.data"
                  :index="index"
                  :isLast="index === sectionsToDisplay.length - 1"
                  @moveUp="moveSectionUp"
                  @moveDown="moveSectionDown"
                  @remove="removeSection"
                  @update="updateSection"
                ></component>
            </TransitionGroup>
            <div class="add-buttons">
              <button class="add-section" @click="createTextSection()">
                <IconAlphabetLatin class="icon" />
                <span>Dodaj sekcję tekstową</span>
              </button>
              <button class="add-section" @click="createImageSection()">
                <IconPhoto class="icon" />
                <span>Dodaj zdjęcie</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="page-error">
          <div class="page-error__container">
            <div class="page-error__header">
              <ArchiveBoxXMarkIcon class="icon" />
              <span>Wystąpił błąd</span>
            </div>
            <div class="page-error__description">Nie udało się załadować danych instrukcji, prawdopobnie taka instrukcja nie istnieje lub nie masz do niej dostępu, odśwież stronę lub wróć na stronę główną.</div>
            <div class="page-error__actions">
              <NuxtLink to="/moje-dokumentacje" class="text-button text-button__medium text-button__secondary">
                <span>Moje dokumentacje</span>
              </NuxtLink>
              <button class="text-button text-button__medium text-button__primary" @click="initPage()">
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
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openModelSelector()">
            <IconCar class="button-icon" />
            <span>Model</span>
          </button>
          <button v-else-if="mobileView === 'modelSelector'" class="text-button text-button__large text-button__secondary" @click="closeModelSelector()">
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

  &__model-selector {
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

    .editor {
      @apply w-full max-w-screen-lg h-auto mx-auto;
      .field {
        &__input {
          input,
          textarea {
            @apply w-full bg-zinc-900;
          }
          textarea {
            @apply h-32;
          }
        }
      }

      &__header {
        @apply w-full h-auto flex items-end space-x-3 mb-3;

        .title-input {
          @apply w-full h-auto flex-grow;
        }

        .actions {
          .loader {
            @apply space-x-1;

            .dot {
              @apply w-2 h-2;
            }
          }
        }
      }

      &__description {
        @apply w-full h-auto mb-3;
      }

      &__section-title {
        @apply text-sm font-light text-zinc-400 mb-1;
      }

      &__sections {
        @apply w-full h-auto relative;

        .section-wrapper {
          @apply w-full h-auto;
        }

        .add-buttons {
          @apply w-full h-auto flex items-center space-x-3;

          .add-section {
            @apply w-full h-auto p-3 py-6 rounded-lg bg-zinc-900 flex flex-col items-center justify-center text-zinc-400 duration-150;
  
            .icon {
              @apply w-6 h-6;
            }
  
            span {
              @apply text-sm;
            }
  
            &:active {
              @apply bg-zinc-950;
            }
  
            &:hover {
              @apply text-darkCyan;
            }
          }
        }
      }

      &.disabled {
        @apply pointer-events-none opacity-50;
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

.sections-move,
.sections-enter-active,
.sections-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.sections-enter-from,
.sections-leave-to {
  opacity: 0;
  transform: scale(0) translate(30px, 0);
}

/* .sections-leave-active {
  position: absolute;
} */
</style>
