import axios from 'axios';

export async function generatingImages(query, page, perPage) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '41232425-06f7f23682087e958e17d15ff',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        q: query,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

