export const usePostsService = () => {
  const { performRequest } = useRequests();

  const requestFetchPosts = async (query: URLSearchParams) => {
    const response = await performRequest<{
      posts: Post[],
      meta: any;
    }>('GET', `/posts?${query.toString()}`);
    return response;
  }

  const requestSinglePost = async (id: number) => {
    const response = await performRequest<Post>('GET', `/posts/${id}`);
    return response;
  }

  const requestAddPost = async (payload: FormData) => {
    const response = await performRequest<Post>('POST', `/posts`, payload, true);
    return response;
  }

  const requestEditPost = async (id: number, payload: FormData) => {
    const response = await performRequest<Post>('PATCH', `/posts/${id}`, payload, true);
    return response;
  }

  const requestPostRemoval = async (id: number) => {
    const response = await performRequest('DELETE', `/posts/${id}`);
    return response;
  }

  const requestRatePost = async (id: number, rating: boolean) => {
    const response = await performRequest('POST', `/posts/rate/${id}`, {
      rating
    });
    return response;
  }

  const requestRateRemoval = async (id: number) => {
    const response = await performRequest('DELETE', `/posts/rate/${id}`);
    return response;
  }

  const requestReportPost = async (id: number, content: string) => {
    const response = await performRequest('POST', `/posts/report`, {
      post: id,
      content
    });
    return response;
  }

  const requestAddComment = async (post: number, content: string, parent?: number): Promise<PostComment> => {
    const response = await performRequest('POST', `/comments`, {
      post,
      content,
      parent
    });
    return response;
  }

  const requestEditComment = async (id: number, content: string): Promise<PostComment> => {
    const response = await performRequest('PATCH', `/comments/${id}`, {
      content
    });
    return response;
  }

  const requestRateComment = async (id: number, comment: number, rating: boolean | null) => {
    const response = await performRequest('POST', `/comments/rate/${id}`, {
      comment,
      rating
    });
    return response;
  }

  const requestCommentRemoval = async (id: number) => {
    const response = await performRequest('DELETE', `/comments/${id}`);
    return response;
  }

  const requestReportComment = async (id: number, content: string) => {
    const response = await performRequest('POST', `/comments/report`, {
      comment: id,
      content
    });
    return response;
  }

  return {
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
    requestReportPost,
    requestReportComment,
  }
}