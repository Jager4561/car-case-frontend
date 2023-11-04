import { PostsFiltersPayload } from '../filters/filters.model';
import { Post, DetailedPost } from './posts.model';

export const usePostsState = () => {
  const runtimeConfig = useRuntimeConfig();
  const { createErrorToast } = useToasts();
  const { requestRatePost, requestRateRemoval } = usePostsService();

  const posts = useState<Post[] | null>('posts', () => null);
  const postsMeta = useState<{
    page: number;
    total: number;
  } | null>('postsMeta', () => null);
  const postsWithContent = useState<DetailedPost[]>('postsWithContent', () => []);

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

  const fetchPost = async (id: number) => {
    const token = useAuthState().getAccessToken();
    const response = await fetch(`${runtimeConfig.public.apiUrl}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Post fetch error');
    }
    const data = await response.json();
    postsWithContent.value.push(data);
    return data;
  }

  const ratePost = async (id: number, rating: boolean) => {
    let wantedPost = null;
    if(posts.value != null) {
      wantedPost = posts.value!.find(post => post.id === id);
    }
    if(wantedPost == null) {
      wantedPost = postsWithContent.value.find(post => post.id === id);
    }
    if(!wantedPost) {
      createErrorToast('Nieznany błąd!', 'Nie udało się ocenić instrukcji. Spróbuj ponownie później.');
      return;
    }
    const editablePost = { ...wantedPost };
    if(rating) {
      editablePost.isLiked = true;
      editablePost.likes += 1;
      editablePost.dislikes = editablePost.isDisliked ? editablePost.dislikes - 1 : editablePost.dislikes
      editablePost.isDisliked = false;
    } else {
      editablePost.isDisliked = true;
      editablePost.dislikes += 1;
      editablePost.likes = editablePost.isLiked ? editablePost.likes - 1 : editablePost.likes
      editablePost.isLiked = false;
    }
    updatePosts(editablePost);
    try {
      const response = await requestRatePost(id, rating);
      return response;
    } catch (error) {
      updatePosts(wantedPost);
      createErrorToast('Nieznany błąd!', 'Nie udało się ocenić instrukcji. Spróbuj ponownie później.');
      throw error;
    }
  }

  const deleteRating = async (id: number) => {
    let wantedPost = null;
    if(posts.value != null) {
      wantedPost = posts.value!.find(post => post.id === id);
    }
    if(wantedPost == null) {
      wantedPost = postsWithContent.value.find(post => post.id === id);
    }
    if(!wantedPost) {
      createErrorToast('Nieznany błąd!', 'Nie udało się usunąć oceny instrukcji. Spróbuj ponownie później.');
      return;
    }
    const editablePost = { ...wantedPost };
    if(editablePost.isLiked) {
      editablePost.isLiked = false;
      editablePost.likes -= 1;
    } else if (editablePost.isDisliked) {
      editablePost.isDisliked = false;
      editablePost.dislikes -= 1;
    }
    updatePosts(editablePost);
    try {
      const response = await requestRateRemoval(id);
      return response;
    } catch (error) {
      updatePosts(wantedPost);
      createErrorToast('Nieznany błąd!', 'Nie udało się usunąć oceny instrukcji. Spróbuj ponownie później.');
      throw error;
    }
  }

  const updatePosts = (post: Partial<DetailedPost>) => {
    if(post == null) {
      return;
    }
    if(posts.value != null) {
      posts.value = posts.value.map(p => {
        if(p.id === post.id) {
          return {
            ...p,
            ...post
          }
        } else {
          return p;
        }
      });
    }
    const postsWithContentIndex = postsWithContent.value.findIndex(p => p.id === post.id);
    if(postsWithContentIndex === -1) {
      postsWithContent.value.push(post as DetailedPost);
    } else {
      postsWithContent.value = postsWithContent.value.map(p => {
        if(p.id === post.id) {
          return {
            ...p,
            ...post
          }
        } else {
          return p;
        }
      });
    }
  }

  return {
    posts,
    postsMeta,
    postsWithContent,
    fetchPosts,
    fetchPost,
    ratePost,
    deleteRating
  };
};
