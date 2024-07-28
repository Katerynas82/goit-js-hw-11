

export async function searchGalleryQuery(query) {
    const URL = "https://pixabay.com/api/";
    const API_KEY = "38315380-10eeb0cf3b6e9a9ad49e9c507";
    


    return fetch(`${URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .catch((error) => {
        console.log(error);
    })
}