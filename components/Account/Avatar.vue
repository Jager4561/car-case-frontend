<script setup lang="ts">
const props = defineProps<{
  account: Account;
}>();

const { createErrorToast, createWarningToast, createSuccessToast } = useToasts();
const { changeAvatar, removeAvatar } = useAccount();
const imageInput = ref<HTMLInputElement>();

const isLoading = ref(false);

const setNewImage = async () => {
  imageInput.value!.click();
}

const onNewImageSet = async () => {
  const files = imageInput.value!.files;
  if(!files || files.length === 0) {
    createErrorToast('Zmiana zdjęcia profilowego', 'Nie wybrano żadnego zdjęcia!');
    return;
  }
  if(files.length > 1) {
    createWarningToast('Zmiana zdjęcia profilowego', 'Wybrano więcej niż jedno zdjęcie. Aby zmienić zdjęcie profilowe, wybierz tylko jedno zdjęcie.');
    return;
  }
  const file = files[0];
  const acceptableTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if(!acceptableTypes.includes(file.type)) {
    createWarningToast('Zmiana zdjęcia profilowego', 'Wybrano nieobsługiwany format zdjęcia. Aby zmienić zdjęcie profilowe, wybierz zdjęcie w formacie PNG, JPG, WEBP lub GIF.');
    return;
  }
  if(file.size > 5 * 1024 * 1024) {
    createWarningToast('Zmiana zdjęcia profilowego', 'Wybrane zdjęcie jest zbyt duże. Aby zmienić zdjęcie profilowe, wybierz zdjęcie o rozmiarze nie większym niż 5MB.');
    return;
  }
  const formData = new FormData();
  formData.append('avatar', file);
  isLoading.value = true;
  try {
    await changeAvatar(formData);
    createSuccessToast('Zmiana zdjęcia profilowego', 'Zdjęcie profilowe zostało zmienione.');
  } catch (error) {
    createErrorToast('Zmiana zdjęcia profilowego', 'Wystąpił błąd podczas zmiany zdjęcia profilowego. Spróbuj ponownie później.');
    console.error(error);
  } finally {
    isLoading.value = false;
    imageInput.value!.value = '';
  }
}

const deleteAvatar = async () => {
  isLoading.value = true;
  try {
    await removeAvatar();
    createSuccessToast('Usuwanie zdjęcia profilowego', 'Zdjęcie profilowe zostało usunięte.');
  } catch (error) {
    createErrorToast('Usuwanie zdjęcia profilowego', 'Wystąpił błąd podczas usuwania zdjęcia profilowego. Spróbuj ponownie później.');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  imageInput.value = document.createElement('input');
  imageInput.value.type = 'file';
  imageInput.value.accept = 'image/png, image/jpeg, image/webp, image/gif';
  imageInput.value.addEventListener('input', onNewImageSet);
});
</script>

<template>
  <div class="profile-picture">
    <div class="picture">
      <div class="image">
        <div v-if="isLoading" class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <Image v-if="!isLoading" :src="props.account.avatar" />
      </div>
      <div class="description">
        <div class="name">{{ account.avatar != null ? 'Dodano zdjęcie' : 'Nie dodano zdjęcia' }}</div>
        <div class="size">PNG, JPG, WEBP, GIF, Maks. 5MB</div>
      </div>
    </div>
    <div class="actions">
      <button :disabled="isLoading" class="text-button text-button__medium text-button__primary" @click="setNewImage()">
        <span>Zmień zdjęcie</span>
      </button>
      <button :disabled="isLoading" class="text-button text-button__medium text-button__secondary" @click="deleteAvatar()">
        <span>Usuń zdjęcie</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-picture {
  @apply w-full h-auto flex flex-col items-start;
  @apply sm:flex-row sm:items-center sm:justify-between sm:space-x-6;
  @apply lg:flex-col lg:items-start lg:justify-between lg:space-x-0;
  @apply xl:flex-row xl:items-center xl:justify-between xl:space-x-6;

  .picture {
    @apply flex-shrink-0 w-auto h-auto flex items-center space-x-4 mb-3;
    @apply sm:mb-0;
    @apply lg:mb-3;
    @apply xl:mb-0;

    .image {
      @apply w-32 h-32 bg-zinc-900 rounded-full overflow-hidden;

      .loader {
        @apply w-full h-full m-0;
      }
    }

    .description {
      .name {
        @apply text-sm font-semibold mb-1;
      }

      .size {
        @apply text-xs font-extralight;
      }
    }
  }

  .actions {
    @apply w-full flex items-center justify-end space-x-2;
    @apply sm:w-auto;
    @apply lg:w-full;
    @apply 2xl:w-auto;
  }
}
</style>
