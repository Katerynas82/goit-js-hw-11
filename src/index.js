import Notiflix from 'notiflix';
import axios from 'axios';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '38315380-10eeb0cf3b6e9a9ad49e9c507';
let page = 1;
let searchQuery = '';

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

function handleFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');

  fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderImages(images);

    if (images.length < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }

    loadMoreBtn.classList.remove('hidden');
    page++;
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
  }
}

function renderImages(images) {
  const galleryMarkup = images.map(image => createImageCard(image)).join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  initializeLightbox();
}

function createImageCard(image) {
  return `
    <a href="${image.largeImageURL}" class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </a>
  `;
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

async function loadMoreImages() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';

  await fetchImages();

  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = 'Load more';
}
