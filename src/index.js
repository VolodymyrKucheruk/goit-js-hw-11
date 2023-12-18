
import { handleScroll, generatingImages, smoothScroll } from './pixabay_api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElem = document.querySelector('.search-form');
const galleryElem = document.querySelector('.gallery');
const inputElem = document.querySelector('.header_input');
let page = 1;
let lastQuery = '';
let totalHits = 0;
const lightbox = new SimpleLightbox('.photo-card a');

inputElem.addEventListener('input', onInput);
formElem.addEventListener('submit', onSubmit);
inputElem.addEventListener('keydown', onKeydown);

async function onInput() {}
async function onSubmit(event) {
  event.preventDefault();
  const inputValue = inputElem.value.trim().toLowerCase();
  page = 1;
  galleryElem.innerHTML = '';

  try {
    const data = await generatingImages(inputValue, page);
    if (data.hits.length > 0) {
      totalHits = data.totalHits;
      const markup = generateImageCardsMarkup(data.hits);
      galleryElem.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      showTotalHitsMessage(totalHits);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    inputElem.value = '';
    lastQuery = inputValue;
  } catch (error) {
    Notiflix.Notify.failure('An error occurred. Please try again.');
  }
}

function showTotalHitsMessage() {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

async function onKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    page = 1;
    galleryElem.innerHTML = '';
    const inputValue = inputElem.value.trim().toLowerCase();

    try {
      const data = await generatingImages(inputValue, page);
      if (data.hits.length > 0) {
        const markup = generateImageCardsMarkup(data.hits);
        galleryElem.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      inputElem.value = '';
      lastQuery = inputValue;
    } catch (error) {
      Notiflix.Notify.failure('An error occurred. Please try again.');
    }
  }
}
handleScroll(smoothScroll);
handleScroll(loadMore);
async function loadMore() {
  page++;

  try {
    const data = await generatingImages(lastQuery, page);
    if (data.hits.length > 0) {
      const markup = generateImageCardsMarkup(data.hits);
      galleryElem.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure('An error occurred. Please try again.');
  }
}

function generateImageCardsMarkup(images) {
  return images
    .map(
      img => `
    <div class="photo-card">
      <a href="${img.largeImageURL}" class="photo-card-img">
        <img class="current-img" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> ${img.likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${img.views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${img.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${img.downloads}
        </p>
      </div>
    </div>
  `
    )
    .join('');
}

const scrollToTopButton = document.createElement('button');
scrollToTopButton.textContent = 'Up';
scrollToTopButton.classList.add('scroll-to-top-button');
document.body.appendChild(scrollToTopButton);
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
window.addEventListener('scroll', () => {
  const { scrollTop } = document.documentElement;
  const scrollThreshold = 550;
  if (scrollTop > scrollThreshold) {
    scrollToTopButton.classList.add('visible');
  } else {
    scrollToTopButton.classList.remove('visible');
  }
});

