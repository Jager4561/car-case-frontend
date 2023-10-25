import { PostsFiltersPayload } from '../filters/filters.model';
import { Post } from './posts.model';

export const usePostsState = () => {
  const runtimeConfig = useRuntimeConfig();

  const posts = useState<Post[] | null>('posts', () => null);
  const postsMeta = useState<{
    page: number;
    total: number;
  } | null>('postsMeta', () => null);

  const fetchPosts = async (options?: PostsFiltersPayload) => {
    const token = useAuthState().getAccessToken();

    const queryParams = new URLSearchParams();
    if (options) {
      if (options?.search) {
        queryParams.append('search', options.search);
      }
      if (options?.sort) {
        queryParams.append('sort', options.sort);
      }
      if (options?.dateFrom) {
        queryParams.append('dateFrom', options.dateFrom.toISOString());
      }
      if (options?.brand) {
        queryParams.append('brand', options.brand.toString());
      }
      if (options?.model) {
        queryParams.append('model', options.model.toString());
      }
      if (options?.generation) {
        queryParams.append('generation', options.generation.toString());
      }
      if (options?.author) {
        queryParams.append('author', options.author.toString());
      }
    }

    const response = await fetch(
      `${runtimeConfig.public.apiUrl}/posts${
        options != undefined ? '?' + queryParams.toString() : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    posts.value = data.posts;
    postsMeta.value = {
      page: options && options.page ? options.page : 0,
      total: data.meta.total,
    };
    return data;
  };

  return {
    posts,
    postsMeta,
    fetchPosts,
  };
};
