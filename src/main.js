import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchGalleryQuery } from "./js/pixabay-api.js";
import { createImages, clearImages } from "./js/render-function.js";

const form = document.querySelector('.form');
const input = document.querySelector('.form-input');
const loader = document.querySelector('.loader');

form.addEventListener('submit', handleSubmitBtn);

async function handleSubmitBtn(event) {
    event.preventDefault();
    clearImages();
    loader.classList.remove('hidden');

    const searchWord = input.value.trim();

        searchGalleryQuery(`${searchWord}`)
            .then((data) => {
                if (data.total === 0 || searchWord === "") { 
                    iziToast.error({
                        position: 'bottomRight',
                        message: "Sorry, there are no images matching your search query. Please try again!",
                    })
                    loader.classList.add('hidden');
                    return;
                }
                else { createImages(data) }
                loader.classList.add('hidden');
            })
   
    form.reset();
}

