import { PostsFiltersPayload } from '../filters/filters.model';
import { Post, DetailedPost, AddPostPayload } from './posts.model';

export const usePostsState = () => {
  const { createErrorToast } = useToasts();
  const {
    requestFetchPosts,
    requestSinglePost,
    requestAddPost,
    requestEditPost,
    requestPostRemoval,
    requestRatePost,
    requestRateRemoval,
    requestAddComment,
    requestEditComment,
    requestRateComment,
    requestCommentRemoval,
    requestReportComment,
    requestReportPost,
  } = usePostsService();

  const posts = useState<Post[] | null>('posts', () => null);
  const postsMeta = useState<{
    page: number;
    total: number;
  } | null>('postsMeta', () => null);
  const postsWithContent = useState<DetailedPost[]>(
    'postsWithContent',
    () => []
  );

  const fetchPosts = async (options?: PostsFiltersPayload) => {
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
      if (options?.page) {
        queryParams.append('page', options.page.toString());
      }
    }

    try {
      const response = await requestFetchPosts(queryParams) as {
        posts: Post[];
        meta: any;
      };
      posts.value = response.posts;
      postsMeta.value = {
        page: options && options.page ? options.page : 0,
        total: response.meta.total,
      };
      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchPost = async (id: number): Promise<DetailedPost> => {
    try {
      const data = await requestSinglePost(id);
      postsWithContent.value.push(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const addNewPost = async (payload: AddPostPayload) => {
    const formData = new FormData();
    formData.append('status', payload.status);
    formData.append('title', payload.title);
    formData.append('abstract', payload.abstract);
    formData.append('brand', payload.brand.toString());
    formData.append('model', payload.model.toString());
    formData.append('generation', payload.generation.toString());
    formData.append('hull_type', payload.hull_type.toString());
    formData.append('engine', payload.engine.toString());
    let fileIndex = 0;
    const sections = payload.sections.map((c, index) => {
      const parsed = {
        type: c.type,
        size: c.size ? c.size : null,
        content: c.content,
        file: c.type === 'image' ? fileIndex : null,
      };
      if(parsed.file != null) {
        fileIndex++;
      }
      return parsed;
    });
    formData.append('sections', JSON.stringify(sections));
    payload.sections.filter((c) => c.type === 'image').forEach((c) => {
      formData.append('images[]', c.file!);
    });
    try {
      const response = await requestAddPost(formData);
      if(posts.value != null) {
        posts.value = [response, ...posts.value!];
      }
      postsWithContent.value = [response, ...postsWithContent.value];
      return response;
    } catch (error) {
      throw error;
    }
  }

  const editPost = async (id: number, payload: AddPostPayload) => {
    const formData = new FormData();
    formData.append('status', payload.status);
    formData.append('title', payload.title);
    formData.append('abstract', payload.abstract);
    formData.append('brand', payload.brand.toString());
    formData.append('model', payload.model.toString());
    formData.append('generation', payload.generation.toString());
    formData.append('hull_type', payload.hull_type.toString());
    formData.append('engine', payload.engine.toString());
    let fileIndex = 0;
    const sections = payload.sections.map((c, index) => {
      const parsed = {
        type: c.type,
        size: c.size ? c.size : null,
        content: c.content,
        file: c.type === 'image' && c.file != null ? fileIndex : null,
      };
      if(parsed.file != null) {
        fileIndex++;
      }
      return parsed;
    });
    formData.append('sections', JSON.stringify(sections));
    payload.sections.filter((c) => c.type === 'image' && c.file != null).forEach((c) => {
      formData.append('images[]', c.file!);
    });
    try {
      const response = await requestEditPost(id, formData);
      if(posts.value != null) {
        posts.value = posts.value!.map((p) => {
          if(p.id === id) {
            return response;
          } else {
            return p;
          }
        });
      }
      postsWithContent.value = postsWithContent.value.map((p) => {
        if(p.id === id) {
          return response;
        } else {
          return p;
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  const deletePost = async (id: number) => {
    try {
      const response = await requestPostRemoval(id);
      posts.value = posts.value!.filter((p) => p.id !== id);
      postsWithContent.value = postsWithContent.value.filter((p) => p.id !== id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const ratePost = async (id: number, rating: boolean) => {
    let wantedPost = null;
    if (posts.value != null) {
      wantedPost = posts.value!.find((post) => post.id === id);
    }
    if (wantedPost == null) {
      wantedPost = postsWithContent.value.find((post) => post.id === id);
    }
    if (!wantedPost) {
      createErrorToast(
        'Nieznany błąd!',
        'Nie udało się ocenić instrukcji. Spróbuj ponownie później.'
      );
      return;
    }
    const editablePost = { ...wantedPost };
    if (rating) {
      editablePost.isLiked = true;
      editablePost.likes += 1;
      editablePost.dislikes = editablePost.isDisliked
        ? editablePost.dislikes - 1
        : editablePost.dislikes;
      editablePost.isDisliked = false;
    } else {
      editablePost.isDisliked = true;
      editablePost.dislikes += 1;
      editablePost.likes = editablePost.isLiked
        ? editablePost.likes - 1
        : editablePost.likes;
      editablePost.isLiked = false;
    }
    updatePosts(editablePost);
    try {
      const response = await requestRatePost(id, rating);
      return response;
    } catch (error) {
      updatePosts(wantedPost);
      createErrorToast(
        'Nieznany błąd!',
        'Nie udało się ocenić instrukcji. Spróbuj ponownie później.'
      );
      throw error;
    }
  };

  const deleteRating = async (id: number) => {
    let wantedPost = null;
    if (posts.value != null) {
      wantedPost = posts.value!.find((post) => post.id === id);
    }
    if (wantedPost == null) {
      wantedPost = postsWithContent.value.find((post) => post.id === id);
    }
    if (!wantedPost) {
      createErrorToast(
        'Nieznany błąd!',
        'Nie udało się usunąć oceny instrukcji. Spróbuj ponownie później.'
      );
      return;
    }
    const editablePost = { ...wantedPost };
    if (editablePost.isLiked) {
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
      createErrorToast(
        'Nieznany błąd!',
        'Nie udało się usunąć oceny instrukcji. Spróbuj ponownie później.'
      );
      throw error;
    }
  };

  const reportPost = async (id: number, reason: string) => {
    try {
      const response = await requestReportPost(id, reason);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const addComment = async (post: number, content: string, parent?: number) => {
    let wantedPost = null;
    if (posts.value != null) {
      wantedPost = posts.value!.find((p) => p.id === post);
    }
    if (wantedPost == null) {
      wantedPost = postsWithContent.value.find((p) => p.id === post);
    }
    if (!wantedPost) {
      throw new Error('Post not found');
    }
    const editablePost = { ...wantedPost };
    try {
      const response = await requestAddComment(post, content, parent);
      if(parent) {
        const wantedParent = editablePost.comments.findIndex((c) => c.id === parent);
        if(wantedParent !== -1) {
          editablePost.comments[wantedParent].children = [response, ...editablePost.comments[wantedParent].children!];
        } else {
          createErrorToast(
            'Dodawanie komentarza',
            'Nie udało się poprawnie dodać komentarza. Odśwież stronę i zweryfikuj czy komentarz został dodany.'
          );
        }
      } else {
        editablePost.comments = [response, ...editablePost.comments];
      }
      updatePosts(editablePost);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const rateComment = async (id: number, rating: boolean | null) => {
    const wantedComment = findComment(id);
    if(!wantedComment.comment) {
      createErrorToast(
        'Ocenianie komentarza',
        'Nie udało się ocenić komentarza. Spróbuj ponownie później.'
      );
      return;
    }
    const editablePost = { ...wantedComment.post! };
    if(wantedComment.childIndex !== -1) {
      const editableComment = { ...editablePost.comments[wantedComment.index].children![wantedComment.childIndex] };
      if(rating === true) {
        editableComment.isLiked = true;
        editableComment.likes += 1;
        editableComment.dislikes = editableComment.isDisliked ? editableComment.dislikes - 1 : editableComment.dislikes;
        editableComment.isDisliked = false;
      } else if(rating === false) {
        editableComment.isDisliked = true;
        editableComment.dislikes += 1;
        editableComment.likes = editableComment.isLiked ? editableComment.likes - 1 : editableComment.likes;
        editableComment.isLiked = false;
      } else {
        editableComment.isLiked = false;
        editableComment.isDisliked = false;
        editableComment.likes = editableComment.likes - 1;
      }
      editablePost.comments[wantedComment.index].children![wantedComment.childIndex] = editableComment;
    } else {
      const editableComment = { ...editablePost.comments[wantedComment.index] };
      if(rating === true) {
        editableComment.isLiked = true;
        editableComment.likes += 1;
        editableComment.dislikes = editableComment.isDisliked ? editableComment.dislikes - 1 : editableComment.dislikes;
        editableComment.isDisliked = false;
      } else if(rating === false) {
        editableComment.isDisliked = true;
        editableComment.dislikes += 1;
        editableComment.likes = editableComment.isLiked ? editableComment.likes - 1 : editableComment.likes;
        editableComment.isLiked = false;
      } else {
        editableComment.isLiked = false;
        editableComment.isDisliked = false;
        editableComment.likes = editableComment.likes - 1;
      }
      editablePost.comments[wantedComment.index] = editableComment;
    }
    updatePosts(editablePost);
    try {
      const response = await requestRateComment(id, wantedComment.comment.id, rating);
      return response;
    } catch (error) {
      updatePosts(wantedComment.post!);
      createErrorToast(
        'Nieznany błąd!',
        'Nie udało się ocenić komentarza. Spróbuj ponownie później.'
      );
      throw error;
    }
  }

  const editComment = async (id: number, content: string) => {
    const wantedComment = findComment(id);
    if(!wantedComment.comment) {
      throw new Error('Post not found');
    }
    const editablePost = { ...wantedComment.post! };
    try {
      const response = await requestEditComment(id, content);
      if(wantedComment.childIndex !== -1) {
        editablePost.comments[wantedComment.index].children![wantedComment.childIndex] = {
          ...editablePost.comments[wantedComment.index].children![wantedComment.childIndex],
          ...response
        };
      } else {
        editablePost.comments[wantedComment.index] = {
          ...editablePost.comments[wantedComment.index],
          ...response
        };
      }
      updatePosts(editablePost);
    } catch (error) {
      throw error;
    }
  }

  const deleteComment = async (id: number) => {
    const wantedComment = findComment(id);
    if (!wantedComment.comment) {
      throw new Error('Post not found');
    }
    const editablePost = { ...wantedComment.post! };
    try {
      const response = await requestCommentRemoval(id);
      if(wantedComment.childIndex !== -1) {
        editablePost.comments[wantedComment.index].children!.splice(wantedComment.childIndex, 1);
      } else {
        if(wantedComment.comment.children != null && wantedComment.comment.children.length > 0) {
          editablePost.comments[wantedComment.index] = {
            ...editablePost.comments[wantedComment.index],
            status: 'deleted'
          };
        } else {
          editablePost.comments.splice(wantedComment.index, 1);
        }
      }
      updatePosts(editablePost);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const reportComment = async (id: number, reason: string) => {
    try {
      const response = await requestReportComment(id, reason);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const findComment = (id: number) => {
    let wantedComment = null;
    let wantedCommentIndex = -1;
    let wantedChildCommentIndex = -1;
    let wantedPost = null;
    if(posts.value != null) {
      for(let i = 0; i < posts.value.length; i++) {
        const post = posts.value[i];
        for(let j = 0; j < post.comments.length; j++) {
          const comment = post.comments[j];
          if(comment.id === id) {
            wantedComment = comment;
            wantedCommentIndex = j;
            wantedPost = post;
            break;
          } else if(comment.children != null && comment.children.length > 0) {
            wantedChildCommentIndex = comment.children.findIndex((c) => c.id === id);
            if(wantedChildCommentIndex !== -1) {
              wantedComment = comment.children[wantedChildCommentIndex];
              wantedCommentIndex = j;
              wantedPost = post;
              break;
            }
          }
        }
      }
    }
    if(wantedComment == null) {
      for(let i = 0; i < postsWithContent.value.length; i++) {
        const post = postsWithContent.value[i];
        for(let j = 0; j < post.comments.length; j++) {
          const comment = post.comments[j];
          if(comment.id === id) {
            wantedComment = comment;
            wantedCommentIndex = j;
            wantedPost = post;
            break;
          } else if(comment.children != null && comment.children.length > 0) {
            wantedChildCommentIndex = comment.children.findIndex((c) => c.id === id);
            if(wantedChildCommentIndex !== -1) {
              wantedComment = comment.children[wantedChildCommentIndex];
              wantedCommentIndex = j;
              wantedPost = post;
              break;
            }
          }
        }
      }
    }
    return {
      comment: wantedComment,
      index: wantedCommentIndex,
      childIndex: wantedChildCommentIndex,
      post: wantedPost
    };
  }

  const updatePosts = (post: Partial<DetailedPost>) => {
    if (post == null) {
      return;
    }
    if (posts.value != null) {
      posts.value = posts.value.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            ...post,
          };
        } else {
          return p;
        }
      });
    }
    const postsWithContentIndex = postsWithContent.value.findIndex(
      (p) => p.id === post.id
    );
    if (postsWithContentIndex === -1) {
      postsWithContent.value.push(post as DetailedPost);
    } else {
      postsWithContent.value = postsWithContent.value.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            ...post,
          };
        } else {
          return p;
        }
      });
    }
  };

  const resetState = () => {
    posts.value = null;
    postsMeta.value = null;
    postsWithContent.value = [];
  }

  return {
    posts,
    postsMeta,
    postsWithContent,
    fetchPosts,
    fetchPost,
    addNewPost,
    editPost,
    deletePost,
    ratePost,
    deleteRating,
    addComment,
    rateComment,
    editComment,
    deleteComment,
    reportComment,
    reportPost,
    resetState,
  };
};
