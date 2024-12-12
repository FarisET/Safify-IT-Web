const usePut = (url, config = {}) => {
    return useFetch(url, 'PUT', config.body, config);
};
export default usePut;