import { HullType, ModelGeneration } from "./models.model";
import lodash from 'lodash';

export const useModelsState = () => {
  const runtimeConfig = useRuntimeConfig();

  const models = useState<ModelGeneration[] | null>('models', () => null);
  const fetchPending = useState<boolean>('modelsFetchPending', () => false);

  const fetchModels = async () => {
    fetchPending.value = true;
    const response = await fetch(`${runtimeConfig.public.apiUrl}/models`);
    const data = await response.json();
    models.value = data;
    fetchPending.value = false;
    return data;
  }


  return {
    models,
    fetchPending,
    fetchModels,
  }
}