import {
  hamburger,
  navMenu,
  pageContainer,
  exitnavBar,
  navContact,
  mainNavBar,
} from "./nav.js";
import { btnEl } from "./buttons.js";
import { cars } from "./allCarsobj.js";

const imageContainerEl = document.querySelector(".image-container ");

const prevEl = document.getElementById("prev");
const nextEl = document.getElementById("next");

let x = 0;
let timer;
prevEl.addEventListener("click", () => {
  clearTimeout(timer);
  x = x + 45;
  updateGalary();
});
nextEl.addEventListener("click", () => {
  clearTimeout(timer);
  x = x - 45;
  updateGalary();
});
function updateGalary() {
  imageContainerEl.style.transform = `perspective(1000px) rotateY(${x}deg)`;
  timer = setTimeout(() => {
    x = x - 45;
    updateGalary();
  }, 3000);
}
updateGalary();

// now carousel overrides js
let carouselTrack = document.querySelector(".carousel__track");
let carouselNav = document.querySelector(".carousel__nav");
cars.forEach((car, index) => {
  let list = document.createElement("li");
  list.classList.add("carousel__slide");
  list.classList.add("current-slide");

  list.innerHTML = `<div>
                  <img
                    class="carousel__image"
                    src=${car.url}
                    alt=""
                  />
                  <div class="description">
                    <h2>${car.name}</h2>
                    <p>${car.model}</p>
                  </div>
                </div>`;

  carouselTrack.appendChild(list);

  // now create the dots but we are not showing them here
  let button = document.createElement("button");
  if (index === 0) {
    button.classList.add("current-slide");
    button.classList.add("carousel__indicator");
  } else {
    button.classList.add("carousel__indicator");
  }
  carouselNav.appendChild(button);
});
import("./carousel.js");
