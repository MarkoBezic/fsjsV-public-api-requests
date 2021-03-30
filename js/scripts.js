//global variables
let employees = [];
let globalIndex;
const urlAPI = `https://randomuser.me/api/?results=12&nat=au,ca,ch,de,es,gb,ie,nz,us`;
const searchContarinerEl = document.querySelector(".search-container");
const galleryEl = document.querySelector("#gallery");
let cardEls;

//add search element to page
searchContarinerEl.innerHTML = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
//filter employees based on search
searchContarinerEl.addEventListener("keyup", () => {
  const searchInput = document.querySelector("#search-input");
  performSearch(searchInput.value);
});

function performSearch(input) {
  let filteredEmployees = [];
  employees.forEach((employee) => {
    if (
      input.length > 0 &&
      (employee.name.first.toLowerCase().includes(input.toLowerCase()) ||
        employee.name.last.toLowerCase().includes(input.toLowerCase()))
    ) {
      filteredEmployees.push(employee);
    } else if (input.length === 0) {
      filteredEmployees.push(employee);
    }
  });
  galleryEl.innerHTML = "";
  appendEmployeHTMLStringToDOM(filteredEmployees);
}

//fetch data for 12 random users from randomuser.me and display to page
fetch(urlAPI)
  .then((response) => response.json())
  .then((response) => response.results)
  .then(displayEmployees)
  .catch((error) => console.log("something went wrong", error));

function displayEmployees(data) {
  employees = data;
  appendEmployeHTMLStringToDOM(employees);
}

//create EmployeeHTMLElement
function createEmployeeHTMLElement(data) {
  let employeesHTMLString = "";

  data.forEach((employee) => {
    let {
      name,
      email,
      location: { city, state },
      picture,
    } = employee;

    employeesHTMLString += `
      <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
            <p class="card-text">${email}</p>
            <p class="card-text cap">${city}, ${state}</p>
        </div>
      </div>
    `;
  });
  return employeesHTMLString;
}

//add employee cards to the DOM
function appendEmployeHTMLStringToDOM(employees) {
  galleryEl.insertAdjacentHTML(
    "beforeend",
    createEmployeeHTMLElement(employees)
  );
}

//create modal window when an employee card is clicked
////create the the modal element
function createModalHTMLElement(index) {
  let {
    name,
    dob,
    cell,
    email,
    location: { city, street, state, country, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);

  let formattedCell = formatCell(cell);

  let modalHTMLString = `
  <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
            <p class="modal-text">${email}</p>
            <p class="modal-text cap">${city}</p>
            <hr>
            <p class="modal-text">${formattedCell}</p>
            <p class="modal-text">${street.number} 
                                  ${street.name}, 
                                  ${city}, 
                                  ${state}
                                  ${postcode}</p>
            <p class="modal-text">Birthday: ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</p>
        </div>
    </div>

    // IMPORTANT: Below is only for exceeds tasks 
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  </div>
  `;
  return modalHTMLString;
}

////append modal element to the DOM
function appendModalToDOM(string) {
  galleryEl.insertAdjacentHTML("afterend", string);
  createCloseModalListener();
  //add event listner to prev and next buttons
  const nextBtn = document.querySelector("#modal-next");
  const prevBtn = document.querySelector("#modal-prev");
  console.log(globalIndex);
  nextBtn.addEventListener("click", () => {
    if (globalIndex >= employees.length - 1) {
      globalIndex = 0;
      galleryEl.nextElementSibling.remove();
      displayModal(globalIndex);
    } else {
      globalIndex += 1;
      galleryEl.nextElementSibling.remove();
      displayModal(globalIndex);
    }
  });
  prevBtn.addEventListener("click", () => {
    if (globalIndex <= 0) {
      globalIndex = employees.length - 1;
      galleryEl.nextElementSibling.remove();
      displayModal(globalIndex);
    } else {
      globalIndex -= 1;
      galleryEl.nextElementSibling.remove();
      displayModal(globalIndex);
    }
  });
}
////display modal
function displayModal(index) {
  globalIndex = index;
  appendModalToDOM(createModalHTMLElement(globalIndex));
}

////helper function to format cell numbers
function formatCell(cellNumber) {
  const cleaned = "" + cellNumber.replace(/\D/g, "");

  const regex = /^(\d{3})(\d{3})\D*(\d*)$/;
  let formatCell;

  //if the phone number is greater than 10 digest remove leading zeros
  if (cleaned.length > 10) {
    const noLeadingZeros = +cleaned;
    formattedCell = noLeadingZeros.toString().replace(regex, "($1) $2-$3");
  } else {
    formattedCell = cleaned.replace(regex, "($1) $2-$3");
  }
  return formattedCell;
}

//add close button even listener and remove modal when clicked
function createCloseModalListener() {
  let modalCloseButton = document.querySelector(".modal-close-btn");
  modalCloseButton.addEventListener("click", () => {
    document.querySelector(".modal-container").remove();
  });
}

//listen for click on card elements and display the modal the corresponds with that employee
galleryEl.addEventListener("click", (e) => {
  if (e.target !== galleryEl) {
    const card = e.target.closest(".card");
    employees.map((employee, index) => {
      if (card.lastElementChild.children[1].innerText === employee.email) {
        globalIndex = index;
      }
    });
  }
  displayModal(globalIndex);
  createCloseModalListener();
});
