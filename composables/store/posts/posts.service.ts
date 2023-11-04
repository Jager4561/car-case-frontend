export const usePostsService = () => {
  const { performRequest } = useRequests();

  const requestRatePost = async (id: number, rating: boolean) => {
    const response = performRequest('POST', `/posts/rate/${id}`, {
      rating
    });
    return response;
  }

  const requestRateRemoval = async (id: number) => {
    const response = performRequest('DELETE', `/posts/rate/${id}`);
    return response;
  }

  return {
    requestRatePost,
    requestRateRemoval
  }
}