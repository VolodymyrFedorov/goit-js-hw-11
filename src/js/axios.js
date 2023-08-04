import axios from 'axios';

const TOKEN = '38624566-af41cffce0f190c9247202d72';
axios.defaults.baseURL = `https://pixabay.com/api/`;

async function searchByQuery(query, page) {
  return axios.get(`?key=${TOKEN}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
};
export {searchByQuery}