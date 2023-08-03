function createCardMarkup({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) {
  return `<a href="${largeImageURL}" class="photo-card">
    <div class="img-container"><img class="card-img" src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
    <div class="info">
      <p class="item">
        <b>Likes</b> <span class="text-number">${likes}</span>
      </p>
      <p class="item">
        <b>Views</b> <span class="text-number">${views}</span>
      </p>
      <p class="item">
        <b>Comments</b> <span class="text-number">${comments}</span>
      </p>
      <p class="item">
        <b>Downloads</b> <span class="text-number">${downloads}</span>
      </p>
    </div>
  </a>`;
}

export {createCardMarkup}