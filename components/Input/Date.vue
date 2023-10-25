<script setup lang="ts">
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  modelValue: Date | null;
}>();
const emit = defineEmits(['update:modelValue']);

const monthsNames = ref([
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
]);

const yearSelectOpen = ref(false);
const calendarOpen = ref(false);
const input = ref<HTMLDivElement | null>(null);
const calendar = ref<HTMLDivElement | null>(null);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const years = ref<number[]>([]);
const yearSelectRef = ref<HTMLDivElement | null>(null);
const monthDays = ref<{
  date: Date;
  day: number;
  month: number;
  year: number;
  today: boolean;
  selected: boolean;
  disabled: boolean;
}[]>([]);
const selectedDate = computed(() => {
  if(props.modelValue == null) return null;
  const day = props.modelValue.getDate() < 10 ? `0${props.modelValue.getDate()}` : props.modelValue.getDate();
  const month = props.modelValue.getMonth() + 1 < 10 ? `0${props.modelValue.getMonth() + 1}` : props.modelValue.getMonth() + 1;
  return `${day}.${month}.${props.modelValue.getFullYear()}`;
});

onMounted(() => {
  if(props.modelValue != null) {
    currentMonth.value = props.modelValue.getMonth();
    currentYear.value = props.modelValue.getFullYear();
  }
  window.addEventListener('click', isClickedOutside);
  for(let i = new Date().getFullYear(); i >= 1886; i--) {
    years.value.push(i);
  }
  generateMonthDays();
});
const toggleCalendar = () => {
  calendarOpen.value = !calendarOpen.value;
  generateMonthDays();
};

const goToNextMonth = () => {
  if(currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  generateMonthDays();
};

const goToPreviousMonth = () => {
  if(currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  generateMonthDays();
};

const openYearSelect = () => {
  yearSelectOpen.value = true;
  setTimeout(() => {
    if(yearSelectRef.value) {
      const elIndex = years.value.findIndex(year => year === currentYear.value);
      const wantedEl = yearSelectRef.value.children[elIndex] as HTMLButtonElement;
      yearSelectRef.value.scrollTo({
        top: wantedEl.offsetTop,
        behavior: 'smooth',
      })
    }
  }, 300);
};

const goToYear = (year: number) => {
  currentYear.value = year;
  yearSelectOpen.value = false;
  generateMonthDays();
}

const generateMonthDays = () => {
  const days: any[] = [];
  const date = new Date(currentYear.value, currentMonth.value, 1);
  const firstDay = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const lastMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const nextMonthFirstDay = new Date(currentYear.value, currentMonth.value + 1, 1).getDay() === 0 ? 6 : new Date(currentYear.value, currentMonth.value + 1, 1).getDay() - 1;
  const today = new Date();
  for(let i = firstDay; i > 0; i--) {
    days.push({
      date: new Date(currentYear.value, currentMonth.value - 1, lastMonthLastDay - i + 1),
      day: lastMonthLastDay - i + 1,
      month: currentMonth.value - 1,
      year: currentYear.value,
      today: false,
      selected: false,
      disabled: true,
    });
  }
  for(let i = 1; i <= lastDay; i++) {
    days.push({
      date: new Date(currentYear.value, currentMonth.value, i),
      day: i,
      month: currentMonth.value,
      year: currentYear.value,
      today: today.getDate() === i && today.getMonth() === currentMonth.value && today.getFullYear() === currentYear.value,
      selected: props.modelValue != null && props.modelValue.getDate() === i && props.modelValue.getMonth() === currentMonth.value && props.modelValue.getFullYear() === currentYear.value,
      disabled: false,
    });
  }
  for(let i = 1; i <= 6 - nextMonthFirstDay; i++) {
    days.push({
      date: new Date(currentYear.value, currentMonth.value + 1, i),
      day: i,
      month: currentMonth.value + 1,
      year: currentYear.value,
      today: false,
      selected: false,
      disabled: true,
    });
  }
  monthDays.value = days;
}

const setDate = (date: Date) => {
  emit('update:modelValue', date);
  calendarOpen.value = false;
};

const clearInput = () => {
  emit('update:modelValue', null);
  calendarOpen.value = false;
};

const isClickedOutside = (event: MouseEvent) => {
  if (calendarOpen.value && input.value && calendar.value) {
    if (!input.value.contains(event.target as Node) && !calendar.value.contains(event.target as Node) && event.target !== input.value && event.target !== calendar.value) {
      calendarOpen.value = false;
    }
  }
};
</script>

<template>
  <div class="date_input">
    <div ref="input" class="field__input field__with-icon" @click="toggleCalendar()">
      <div class="inputlike">
        <span v-if="props.modelValue == null" class="placeholder">Wybierz datę</span>
        <div v-if="props.modelValue != null" class="value">
          {{ selectedDate }}
        </div>
      </div>
      <CalendarDaysIcon />
    </div>
    <Transition name="calendar">
      <div ref="calendar" v-show="calendarOpen" class="calendar">
        <Transition name="fade" mode="out-in">
          <div v-if="!yearSelectOpen" class="date-select">
            <div class="header">
              <button class="icon-button icon-button__secondary icon-button__small" @click="goToPreviousMonth()">
                <ChevronLeftIcon />
              </button>
              <button class="text-button text-button__thertiary text-button__small" @click="openYearSelect()">
                <span>{{ monthsNames[currentMonth] + ' ' + currentYear }}</span>
              </button>
              <button class="icon-button icon-button__secondary icon-button__small" @click="goToNextMonth()">
                <ChevronRightIcon />
              </button>
            </div>
            <div class="week_days">
              <div class="day_name">Pon</div>
              <div class="day_name">Wt</div>
              <div class="day_name">Śr</div>
              <div class="day_name">Czw</div>
              <div class="day_name">Pt</div>
              <div class="day_name">Sob</div>
              <div class="day_name">Ndz</div>
              <button v-for="day in monthDays" class="day" :class="{today: day.today, selected: day.selected, disabled: day.disabled}" @click="setDate(day.date)">
                {{ day.day }}
              </button>
            </div>
          </div>
          <div ref="yearSelectRef" v-else class="year-select">
            <button v-for="year in years" class="year-button" :class="{active: year === currentYear}" @click="goToYear(year)">
              {{ year }}
            </button>
          </div>
        </Transition>
        <div class="actions">
          <button class="button button__secondary button__small" @click="clearInput()">
            <span>Wyczyść pole</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.date_input {
  @apply w-full h-auto relative;
  .field__input {
    @apply cursor-pointer;
  }

  .calendar {
    @apply w-full h-auto absolute top-full left-0 rounded-lg bg-zinc-800 border border-zinc-700 mt-1 overflow-y-auto z-10;
    transform-origin: top;

    .date-select {
      @apply w-full h-auto;
    }

    .header {
      @apply w-full h-auto flex items-center justify-between p-1;

      span {
        @apply text-xs text-zinc-300;
      }
    }

    .week_days {
      @apply w-full h-auto grid grid-cols-7 px-1;

      .day_name {
        @apply text-xs font-bold text-zinc-300 p-2 flex items-center justify-center;
      }

      .day {
        @apply rounded flex items-center justify-center p-1 text-xs text-zinc-200 duration-200;
      }

      .today {
        @apply text-darkCyan;
      }

      .selected {
        @apply bg-zinc-700;
      }

      .disabled {
        @apply text-zinc-600 pointer-events-none;
      }

      .day:hover {
        @apply bg-zinc-700;
      }
    }

    .year-select {
      @apply w-full max-h-52 overflow-y-auto;

      .year-button {
        @apply w-full h-auto text-center text-sm p-2 duration-200 hover:bg-zinc-700;
      }
      
      .year-button.active {
        @apply bg-zinc-700;
      }
    }

    .actions {
      @apply w-full h-auto p-1;
    }
  }
}

.calendar-enter-active,
.calendar-leave-active {
  transition: all 0.2s ease;
}

.calendar-enter-from,
.calendar-leave-to {
  transform: scale(0.8) translateY(-10px);
  opacity: 0;
}
</style>
