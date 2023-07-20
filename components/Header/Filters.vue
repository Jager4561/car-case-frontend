<script setup lang="ts">
  const props = defineProps<{
    isOpen: boolean;
  }>();
  const emit = defineEmits(['update:isOpen']);

  const closeFilters = () => {
    emit('update:isOpen', false);
  }
</script>

<template>
  <div class="filters">
    <div class="filters__title">
      Ogólne
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Data dodania (od):</label>
        <input type="datetime-local">
      </div>
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Data dodania (do):</label>
        <input type="datetime-local">
      </div>
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Sortuj po:</label>
        <select>
          <option value="date">Dacie dodania (rosnąco)</option>
          <option value="date">Dacie dodania (malejąco)</option>
          <option value="name">Nazwie (rosnąco)</option>
          <option value="name">Nazwie (malejąco)</option>
          <option value="views">Liczbie wyświetleń (rosnąco)</option>
          <option value="views">Liczbie wyświetleń (malejąco)</option>
          <option value="likes">Liczbie polubień (rosnąco)</option>
          <option value="likes">Liczbie polubień (malejąco)</option>
        </select>
      </div>
    </div>
    <div class="filters__title">
      Modele
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Marka</label>
        <select>
          <option value="date">Audi</option>
          <option value="date">Mercedes</option>
        </select>
      </div>
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Model</label>
        <select disabled>
          <option value="date">Audi</option>
          <option value="date">Mercedes</option>
        </select>
      </div>
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Generacja</label>
        <select disabled>
          <option value="date">I</option>
          <option value="date">II</option>
        </select>
      </div>
    </div>
    <div class="filters__title">
      Autor
    </div>
    <div class="filters__field">
      <div class="input_container">
        <label for="">Nazwa</label>
        <input type="text" placeholder="Szukaj...">
      </div>
    </div>
    <div class="filters__actions">
      <button class="primary_button">
        Zastosuj
      </button>
      <button class="secondary_button">
        Wyczyść filtry
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .filters {
    @apply w-full h-auto bg-zinc-900 shadow shadow-zinc-700 rounded-lg grid grid-cols-2 gap-x-6 gap-y-3 p-6;

    &__title {
      @apply w-full h-auto col-span-2 text-white font-semibold;
    }
    
    &__field {
      @apply w-full h-auto flex;
    }

    &__actions {
      @apply w-full h-auto flex items-center justify-end col-span-2 space-x-3;
    }
  }
</style>