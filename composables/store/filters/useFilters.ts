import { FiltersData } from './filters.model';

export const useFilters = () => {
  const runtimeConfig = useRuntimeConfig();

  const filtersData = useState<FiltersData | null>('filtersData', () => null);
  const fetchPending = useState<boolean>('filtersFetchPending', () => false);

  const fetchFiltersData = async () => {
    fetchPending.value = true;
    const response = await fetch(`${runtimeConfig.public.apiUrl}/models/filters`);
    if(!response.ok) {
      throw new Error('Error fetching filters data');
    }
    const data = await response.json();
    filtersData.value = data;
    fetchPending.value = false;
    return data;
  }

  const resetState = () => {
    filtersData.value = null;
    fetchPending.value = false;
  }

  return {
    filtersData,
    fetchPending,
    fetchFiltersData,
    resetState
  }
}