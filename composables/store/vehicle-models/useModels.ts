import { HullType, ModelGeneration } from "./models.model";
import lodash from 'lodash';

export const useModelsState = () => {
  const runtimeConfig = useRuntimeConfig();

  const errorOccured = useState<boolean>('modelsErrorOccured', () => false);
  const models = useState<ModelGeneration[] | null>('models', () => null);
  const fetchPending = useState<boolean>('modelsFetchPending', () => false);

  const fetchModels = async () => {
    fetchPending.value = true;
    const response = await fetch(`${runtimeConfig.public.apiUrl}/models`);
    const data = await response.json();
    fetchPending.value = false;
    if(!response.ok) {
      errorOccured.value = true;
      throw new Error('Error fetching models');
    } else {
      errorOccured.value = false;
    }
    models.value = data;
    return data;
  }

  const resetState = () => {
    models.value = null;
    fetchPending.value = false;
  }

  return {
    models,
    errorOccured,
    fetchPending,
    fetchModels,
    resetState
  }
}