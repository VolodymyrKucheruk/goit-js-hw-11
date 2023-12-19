import {generatingImages} from './pixabay_api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formElem = document.querySelector('.search-form');
const galleryElem = document.querySelector('.gallery');
const inputElem = document.querySelector('.header_input');
const loadMoreButton = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.photo-card a');

let page = 1;
let lastQuery = '';
let totalHits = 0;
let isLoading = false;
const imagesPerPage = 40;

inputElem.addEventListener('input', onInput);
formElem.addEventListener('submit', onSubmit);
inputElem.addEventListener('keydown', onKeydown);
loadMoreButton.addEventListener('click', loadMore);

const scrollToTopButton = createScrollToTopButton();

window.addEventListener('scroll', handleScrollVisibility);

async function onInput() {};

async function onSubmit(event) {
  event.preventDefault();
  handleSearch();
}

async function onKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSearch();
  }
}

async function loadMore() {
    if (isLoading) {
      return;
    }
  
    isLoading = true;
  
    try {
      const data = await generatingImages(lastQuery, page, imagesPerPage);
      handleImageData(data);
      page += 1;
  
      if (page * imagesPerPage >= totalHits) {
        hideLoadMoreButton();
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    } catch (error) {
      Notiflix.Notify.failure('An error occurred. Please try again.');
    } finally {
      isLoading = false;
    }
  }
  

function handleImageData(data) {
  if (data.hits.length > 0) {
    totalHits = data.totalHits;
    const markup = generateImageCardsMarkup(data.hits);
    galleryElem.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    showSuccessMessage();
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  lastQuery = inputElem.value;
}

async function handleSearch() {
  page = 1;
  galleryElem.innerHTML = '';
  const inputValue = inputElem.value.trim().toLowerCase();

  try {
    const data = await generatingImages(inputValue, page, imagesPerPage);
    handleImageData(data);
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

function createScrollToTopButton() {
    const scrollToTopButton = document.createElement('button');
      scrollToTopButton.textContent = 'Up';
      scrollToTopButton.classList.add('scroll-to-top-button');
      document.body.appendChild(scrollToTopButton);
      scrollToTopButton.addEventListener('click', scrollToTop);
      return scrollToTopButton;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function handleScrollVisibility() {
  const { scrollTop } = document.documentElement;
  const scrollThreshold = 550;

  if (scrollTop > scrollThreshold) {
    scrollToTopButton.classList.add('visible');
  } else {
    scrollToTopButton.classList.remove('visible');
  }
}

function showSuccessMessage() {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function showLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.add('visible');
  }
}

function hideLoadMoreButton() {
  if (loadMoreButton) {
    loadMoreButton.classList.remove('visible');
  }
}
