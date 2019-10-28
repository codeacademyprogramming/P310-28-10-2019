"use strict";

const createPaginationItem = i => {
  const li = document.createElement("li");
  li.classList.add("page-item");

  const a = document.createElement("a");
  a.classList.add("page-link");
  a.innerText = i;

  if (i === 1) {
    li.classList.add("active");
  }

  li.appendChild(a);
  pagination.appendChild(li);

  li.onclick = function(e) {
    const searchWord = query.value;
    const size = sizes.value;

    document
      .querySelector("ul#pagination li.active")
      .classList.remove("active");
    this.classList.add("active");

    const url =
      "https://api.unsplash.com/search/photos?" +
      `query=${searchWord}&` +
      "per_page=12&" +
      `page=${i}&` +
      "client_id=1e671c8f34db5e89f74ca8a3494def1cb0d608b51d5225605e711da1f6ccf900";

    SendRequest(url, size, false);
  };
};

sendBtn.onclick = function() {
  const searchWord = query.value;
  const size = sizes.value;

  const url =
    "https://api.unsplash.com/search/photos?" +
    `query=${searchWord}&` +
    "per_page=12&" +
    "client_id=1e671c8f34db5e89f74ca8a3494def1cb0d608b51d5225605e711da1f6ccf900";

  SendRequest(url, size, true);
};

const SendRequest = (url, size, recreatePagination) => {
  photos_list.innerHTML = "";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (recreatePagination) {
        pagination.innerHTML = "";
      }
      const total = data.total;
      const total_pages = data.total_pages;
      const results = data.results;

      if (total_pages <= 6) {
        for (let i = 0; i < total_pages; i++) {
          createPaginationItem(i + 1);
        }
      } else {
        const numbers = [
          1,
          2,
          3,
          "...",
          total_pages - 2,
          total_pages - 1,
          total_pages
        ];

        if (recreatePagination) {
          for (let i = 0; i < numbers.length; i++) {
            createPaginationItem(numbers[i]);
          }
        }
      }

      results.forEach(photo => {
        const card = `<div class="card mx-1 my-2" style="width: 22rem;">
        <img src="${
          photo.urls[size]
        }" style="height:400px; object-fit: cover;" class="card-img-top" />
        <div class="card-body">
          <h5 class="card-title">${
            photo.description
              ? photo.description.substring(0, 15) + "..."
              : "No description"
          }</h5>
          <p class="card-text">
            <i class="far fa-heart"></i> 
            <span>${photo.likes}</span>
          </p>
          <a href="#" class="btn btn-primary">See details</a>
        </div>
      </div>`;

        photos_list.innerHTML += card;
      });
    });
};
