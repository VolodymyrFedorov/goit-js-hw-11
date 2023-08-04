import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createCardMarkup } from './js/markupService'
import { elements } from './js/elements';
import { searchByQuery } from './js/axios';

let counter = 1;
let searchQuery = '';

elements.form.addEventListener('submit', onSearch);
elements.loadMore.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '0px',
  threshold: 1.0
}

const observer = new IntersectionObserver(onLoadMore, options);
const lightbox = new SimpleLightbox('.gallery a', {
  showCounter: false,
captionsData: 'alt'});

async function onSearch(evt) {
  evt.preventDefault();
  observer.unobserve(elements.loadMore);
  searchQuery = evt.currentTarget.searchQuery.value.trim().split(' ').join('+');
  counter = 1;
  elements.gallery.innerHTML = '';

  if (!searchQuery) {
    Notify.warning('Please enter a search query.');
    return;
  }

  try {
    elements.loader.style.display = 'inline-block';
    const resp = await searchByQuery(searchQuery, counter);
    const totalHits = resp.data.totalHits;

    if (!totalHits) {
      throw new Error('Sorry, there are no images matching your search query. Please try again.');
    }

    Notify.info(`Hooray! We found ${totalHits} images.`);

    const cardsMarkup = resp.data.hits.map(createCardMarkup).join('');
    elements.gallery.insertAdjacentHTML('beforeend', cardsMarkup);

     if (totalHits < 40) {
      elements.loadMore.style.display = 'none';
    } else {
      elements.loadMore.style.display = 'block';
      observer.observe(elements.loadMore);
    }

    lightbox.refresh();

  } catch (err) {
    Notify.warning(err.message);
    elements.loader.style.display = 'none';
    return;
  }

  elements.loader.style.display = 'none';
  counter = 1;
  observer.observe(elements.loadMore);
}

async function onLoadMore(entries) {
  if (entries[0].intersectionRatio <= 0) return;
  counter += 1;
  elements.loadMore.style.display = 'none';

  try {
    elements.loader.style.display = 'inline-block';
    const resp = await searchByQuery(searchQuery, counter);
    const cardsMarkup = resp.data.hits.map(createCardMarkup).join('');
    elements.gallery.insertAdjacentHTML('beforeend', cardsMarkup);
    elements.loadMore.style.display = 'block';

    lightbox.refresh();
    
    if (counter * 40 >= resp.data.totalHits) {
      throw new Error(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (err) {
    Notify.warning(`${err.message}`);
    observer.unobserve(entries[0].target);
    elements.loader.style.display = 'none';
    elements.loadMore.style.display = 'block';
    return;
  }
  smoothScroll();
}

function smoothScroll() {
  const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight,
    behavior: "smooth",
  });
}