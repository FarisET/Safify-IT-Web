const usePost = (url, config = {}) => {
    return useFetch(url, 'POST', config.body, config);
};

export default usePost;