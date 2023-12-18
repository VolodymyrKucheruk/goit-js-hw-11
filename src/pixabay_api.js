import axios from 'axios';

export async function generatingImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '41232425-06f7f23682087e958e17d15ff',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        q: query,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

export function handleScroll(callback) {
  let lastScrollTop = 0;
  const header = document.querySelector('.header');
  let scrollDirection = '';

  window.addEventListener('scroll', async () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      try {
        await callback();
      } catch (error) {
        console.error('An error occurred while loading more:', error);
      }
    }

    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      if (scrollDirection !== 'down') {
        scrollDirection = 'down';
        header.classList.add('hidden');
      }
    } else {
      if (scrollDirection !== 'up') {
        scrollDirection = 'up';
        header.classList.remove('hidden');
      }
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });
}
