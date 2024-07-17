import {
  hamburger,
  navMenu,
  pageContainer,
  exitnavBar,
  navContact,
  mainNavBar,
} from "./nav.js";
import { checkLoggedIn } from "./checkLogin.js";
import { btnEl } from "./buttons.js";

// now we will get the specific car info
const baseUrl = "";

let carName = localStorage.getItem("purchCarName");
let carModel = localStorage.getItem("purchCarBrand");

let myCar = [];
let imageUrl = "";
fetch(baseUrl + `/api/cars/specificcar/${carName}/${carModel}`)
  .then((response) => response.json())
  .then((data) => {
    // Loop through the array
    data.forEach((item) => {
      item.info.url = `data:image/jpeg;base64,${item.imageData}`;

      myCar.push(item.info);
    });

    imageUrl = myCar[0].url;
    loadData();
  });

let loadData = function () {
  let headerImg = document.querySelector(".header");
  let myGradient = "linear-gradient(to bottom, #00000069, #00000038)";

  headerImg.style.background =
    "url(" +
    imageUrl +
    ") center center / cover no-repeat," +
    myGradient +
    " no-repeat";
  let headerPrice = document.querySelector(".header .headerprice");

  headerPrice.innerHTML = `<p>$${myCar[0].price} <span>per Day</span></p>`;

  let carInfo = document.querySelector(".carInfo");

  let specsArr = myCar[0].specs.split(",");
  let allSpecs = "";
  specsArr.forEach((spec) => {
    allSpecs += `<p><i class="fa-solid fa-check"></i>${spec}</p>`;
  });
  carInfo.innerHTML = ` <h1 class="carInfoCarName">${myCar[0].name} ${myCar[0].model}</h1>
          <div class="reviews">
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span>${myCar[0].stars} reviews</span>
          </div>

          <div class="specific-info">
            <div class="specific-info-child">
              <div>
                <img
                  src="/carRental/images/svgs/person.svg"
                  alt=""
                  class="car-info-svg"
                />
                <p class="personNumber">${myCar[0].numOfSeats} passengers</p>
              </div>
              <div>
                <img
                  src="/carRental/images/svgs/briefcase.svg"
                  alt=""
                  class="car-info-svg"
                />
                <p class="bagage-number">${myCar[0].bagageSpace} luggages</p>
              </div>
            </div>
            <div class="specific-info-child">
              <div>
                <img
                  src="/carRental/images/svgs/gearshift.svg"
                  alt=""
                  class="car-info-svg"
                />
                <p class="tramission-type">auto</p>
              </div>
              <div>
                <img
                  src="/carRental/images/purchaseCar/carpng.png"
                  alt=""
                  class="car-info-svg"
                />
                <p class="numOfDoors">4</p>
              </div>
            </div>
          </div>
          <div class="text-info">
            <h2>Refueling</h2>
            <p>
              Meh synth Schlitz, tempor duis single-origin coffee ea next level
              ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit
              hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil,
              flexitarian Truffaut synth art party deep v chillwave. Seitan High
              Life reprehenderit consectetur cupidatat kogi. Et leggings fanny
              pack, elit bespoke vinyl art party Pitchfork selfies master
              cleanse.
            </p>
          </div>
          <div class="text-info">
            <h2>Car Wach</h2>
            <p>
              Craft beer elit seitan exercitation, photo booth et 8-bit kale
              chips proident chillwave deep v laborum. Aliquip veniam delectus,
              Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone
              Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up
              artisan sunt. Craft beer elit seitan exercitation, photo booth
            </p>
          </div>
          <div class="text-info">
            <h2>No Smoking</h2>
            <p>
              See-through delicate embroidered organza blue lining luxury
              acetate-mix stretch pleat detailing. Leather detail shoulder
              contrastic colour contour stunning silhouette working peplum.
              Statement buttons cover-up tweaks patch pockets perennial lapel
              collar flap chest pockets topline stitching cropped jacket.
              Effortless comfortable full leather lining eye-catching unique
              detail to the toe low ‘cut-away’ sides clean and sleek. Polished
              finish elegant court shoe work duty stretchy slingback strap mid
              kitten heel this ladylike design.
            </p>
          </div>
          <div class="includedFeatures">
            <h3>Included</h3>
            <div>
              ${allSpecs}
            </div>
          </div>
          <div class="notIncludedFeatures">
            <h3>Not Included</h3>
            <div>
              <p><i class="fa-solid fa-x"></i>Gps Navigation</p>
              <p><i class="fa-solid fa-x"></i>Led lights</p>
            </div>
          </div>`;
};

let similarCarGrid = document.querySelector(".similarCars .grid");

let similarCars = [];
fetch(baseUrl + `/api/cars/similar/${carName}/${carModel}`)
  .then((response) => response.json())
  .then((data) => {
    // Loop through the array
    data.forEach((item) => {
      item.info.url = `data:image/jpeg;base64,${item.imageData}`;

      similarCars.push(item.info);
    });

    loadSimilarCarsData();
  });

let loadSimilarCarsData = function () {
  similarCars.forEach((car) => {
    let a = document.createElement("a");
    a.setAttribute("href", "/purchaseCar");
    a.setAttribute("data-purchCarName", `${car.name}`);
    a.setAttribute("data-purchCarType", `${car.model}`);
    let article = document.createElement("article");
    article.innerHTML = ` <article class="article">
              <figure class="article__figure">
                <img
                  class="article__cover"
                  src="${car.url}"
                />
                <figcaption class="article__caption">
                  <h2 class="article__title">${car.name}</h2>
                  <p class="article__info">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Velit odit minus odio cupiditate aliquid quia est sed omnis
                    ut perferendis, culpa illo facere a asperiores deserunt
                    reiciendis ea pariatur! Numquam.
                  </p>
                </figcaption>
              </figure>
              <div class="car-info">
                <div class="informations">
                  <h1 class="car-name">${car.model}</h1>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star checked"></span>
                  <span class="fa fa-star"></span>
                  <span class="fa fa-star"></span>
                  <span class="number-of-reviews">${car.stars}</span>
                  <div class="specific-info">
                    <div>
                      <img
                        src="/carRental/images/svgs/person.svg"
                        alt=""
                        class="car-info-svg"
                      />
                      <p class="personNumber">${car.numOfSeats}</p>
                    </div>
                    <div>
                      <img
                        src="/carRental/images/svgs/briefcase.svg"
                        alt=""
                        class="car-info-svg"
                      />
                      <p class="bagage-number">${car.bagageSpace}</p>
                    </div>

                    <div>
                      <img
                        src="/carRental/images/svgs/gearshift.svg"
                        alt=""
                        class="car-info-svg"
                      />
                      <p class="tramission-type">${car.transmission}</p>
                    </div>
                  </div>
                </div>
                <div class="car-price">
                  <h1 class="price">${car.price}</h1>
                  <p>per day</p>
                </div>
              </div>
              <div class="carSpecs" style="display: none"></div>
            </article>`;
    a.appendChild(article);
    a.addEventListener("click", () => {
      localStorage.setItem("purchCarName", car.name);
      localStorage.setItem("purchCarBrand", car.model);
    });
    similarCarGrid.appendChild(a);
  });
};

// now handle the post request for purchase car
const form = document.getElementById("purchase-car-form");
form.addEventListener("submit", (event) => {
  // Prevent the form from being submitted
  event.preventDefault();

  // Get the form data
  const formData = new FormData(form);

  // Validate the input
  const name = formData.get("name");
  if (!name) {
    // If the name field is empty, show an error message
    displayError("Name is required");
    return;
  }
  if (/\d/.test(name)) {
    // If the name field contains numbers, show an
    // If the name field contains numbers, show an error message
    displayError("Name should not contain numbers");
    return;
  }
  const email = formData.get("email");
  if (!email) {
    // If the email field is empty, show an error message
    displayError("Email is required");
    return;
  }
  const phone = formData.get("phone");
  if (!phone) {
    // If the phone field is empty, show an error message
    displayError("Phone is required");
    return;
  }
  if (!/^\+?\d+$/.test(phone)) {
    // If the phone field does not match the pattern +<numbers> or <numbers>, show an error message
    displayError("Phone should be in the format +<numbers> or <numbers>");
    return;
  }
  const pickUpAddress = formData.get("pickUpAddress");
  if (!pickUpAddress) {
    // If the pick up address field is empty, show an error message
    displayError("Pick up address is required");
    return;
  }
  const pickUpDate = formData.get("pickUpDate");
  if (!pickUpDate) {
    // If the pick up date field is empty, show an error message
    displayError("Pick up date is required");
    return;
  }
  const pickUpTime = formData.get("pickUpTime");
  if (!pickUpTime) {
    // If the pick up time field is empty, show an error message
    displayError("Pick up time is required");
    return;
  }
  const dropOffAddress = formData.get("dropOffAddress");
  if (!dropOffAddress) {
    // If the drop off address field is empty, show an error message
    displayError("Drop off address is required");
    return;
  }
  const dropOffDate = formData.get("dropOffDate");
  if (!dropOffDate) {
    // If the drop off date field is empty, show an error message
    displayError("Drop off date is required");
    return;
  }
  const dropOffTime = formData.get("dropOffTime");
  if (!dropOffTime) {
    // If the drop off time field is empty, show an error message
    displayError("Drop off time is required");
    return;
  }

  // If all the fields are valid, send the form data to the server
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    pickUpAddress: formData.get("pickUpAddress"),
    pickUpDate: formData.get("pickUpDate"),
    pickUpTime: formData.get("pickUpTime"),
    dropOffAddress: formData.get("dropOffAddress"),
    dropOffDate: formData.get("dropOffDate"),
    dropOffTime: formData.get("dropOffTime"),
    carname: carName,
    carmodel: carModel,
  };

  document.getElementById("requestBooking").addEventListener("click", () => {
    let userId = sessionStorage.getItem("userId");
    if (userId) {
      console.log(userId);
    } else {
      userId = checkLoggedIn();
    }
    if (userId) {
      data.status = "req";
      fetch(baseUrl + "/form/purchase-car", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        let submit = function () {
          form.submit();
        };
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your request has been sent",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(submit, 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
          setTimeout(submit, 2000);
        }
      });
    }
  });
  document.getElementById("bookInstantly").addEventListener("click", () => {
    let userId = sessionStorage.getItem("userId");
    if (userId) {
      console.log(userId);
    } else {
      userId = checkLoggedIn();
    }

    if (userId) {
      data.status = "purch";
      fetch(baseUrl + "/form/purchase-car", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        let submit = function () {
          form.submit();
        };
        if (response.status === 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your request has been sent",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(submit, 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
          setTimeout(submit, 2000);
        }
      });
    }
  });
});

// Display an error message
function displayError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerText = message;
  setTimeout(() => {
    errorContainer.innerText = "";
  }, 3000);
}
import "./footer.js";
