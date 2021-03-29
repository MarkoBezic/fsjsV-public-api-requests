const searchContarinerEl = document.querySelector(".search-container");
const galleryEl = document.querySelector("#gallery");
let cardEls;

loadPage = async () => {
  searchContarinerEl.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
  generateGallery = (data) => {
    let galleryHTMLString = "";
    data.map((person) => {
      galleryHTMLString += `
            <div class="card">
              <div class="card-img-container">
                  <img class="card-img" src="${person.picture.large}" alt="profile picture">
              </div>
              <div class="card-info-container">
                  <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                  <p class="card-text">${person.email}</p>
                  <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
              </div>
            </div>
      `;
    });
    galleryEl.innerHTML = galleryHTMLString;
    cardEls = document.querySelectorAll(".card");
  };

  await fetch("https://randomuser.me/api/?results=12")
    .then((response) => response.json())
    .then((data) => generateGallery(data.results))
    .catch((error) => console.log("something went wrong", error));

  cardEls.forEach((card) => {
    card.addEventListener("click", () => {
      console.log(card);
    });
  });
};

const modal = `
  < class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
            <h3 id="name" class="modal-name cap">name</h3>
            <p class="modal-text">email</p>
            <p class="modal-text cap">city</p>
            <hr>
            <p class="modal-text">(555) 555-5555</p>
            <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
            <p class="modal-text">Birthday: 10/21/2015</p>
        </div>
    </div>

    // IMPORTANT: Below is only for exceeds tasks 
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </>
`;

loadPage();
