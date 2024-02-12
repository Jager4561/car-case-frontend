import { FiltersData } from './filters.model';

export const useFilters = () => {
  const runtimeConfig = useRuntimeConfig();

  const errorOccured = useState<boolean>('filtersErrorOccured', () => false);
  const filtersData = useState<FiltersData | null>('filtersData', () => null);
  const fetchPending = useState<boolean>('filtersFetchPending', () => false);

  const fetchFiltersData = async () => {
    fetchPending.value = true;
    const response = await fetch(`${runtimeConfig.public.apiUrl}/models/filters`);
    const data = await response.json();
    fetchPending.value = false;
    if(!response.ok) {
      errorOccured.value = true;
      throw new Error('Error fetching filters');
    } else {
      errorOccured.value = false;
    }
    filtersData.value = data;
    return data;
  }

  const resetState = () => {
    filtersData.value = null;
    fetchPending.value = false;
  }

  return {
    filtersData,
    errorOccured,
    fetchPending,
    fetchFiltersData,
    resetState
  }
}