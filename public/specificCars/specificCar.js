const baseUrl = "";

let carName = localStorage.getItem("spCarName");

let carType = localStorage.getItem("spCarType");

let header = document.querySelector(".carNameTypeHeader");
let headerP = document.querySelector(".carNameTypeText");

// let headerContainer = document.querySelector(".SpecificHeader");
let headerContainer = document.querySelector(".header");
let headerMessage = "";

let carsGridContainer = document.getElementById("carsGridContainer");

let imageUrl = "";
let articleCars = [];
if (carName != "none") {
  articleCars = [];
  fetch(baseUrl + `/api/cars/${carName}`)
    .then((response) => response.json())
    .then((data) => {
      // Loop through the array
      data.forEach((item) => {
        item.info.url = `data:image/jpeg;base64,${item.imageData}`;

        articleCars.push(item.info);
      });
      header.innerText = `${carName}`;
      headerMessage = carName;
      imageUrl = articleCars[0].url;
      loadData();
    });
} else {
  articleCars = [];
  fetch(baseUrl + `/api/cars/bytype/${carType}`)
    .then((response) => response.json())
    .then((data) => {
      // Loop through the array
      data.forEach((item) => {
        item.info.url = `data:image/jpeg;base64,${item.imageData}`;

        articleCars.push(item.info);
      });
      header.innerText = `${carType}`;

      headerMessage = carType;
      imageUrl = articleCars[0].url;
      loadData();
    });
}

let loadData = function () {
  // set the header image
  let myGradient = "linear-gradient(to bottom, #00000069, #00000038)";

  headerContainer.style.background =
    "url(" +
    imageUrl +
    ") center center / cover no-repeat," +
    myGradient +
    " no-repeat";

  // set the header text
  headerP.innerText = `Find the ${headerMessage} car that  you like we give best offers for you`;

  articleCars.forEach((car) => {
    let specs = ``;
    let specsArr = car.specs.split(",");
    specsArr.forEach((spec) => {
      specs += `<p><i class="fa-solid fa-check"></i>${spec}</p>`;
    });
    let a = document.createElement("a");
    a.setAttribute("href", "/purchaseCar");
    a.setAttribute("data-purchCarName", `${car.name}`);
    a.setAttribute("data-purchCarType", `${car.model}`);

    let article = document.createElement("article");
    article.classList.add("article");
    article.innerHTML = `<figure class="article__figure">
    <img class="article__cover" src="${car.url}" />
    <figcaption class="article__caption">
      <h2 class="article__title">${car.type}</h2>
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
      <h1 class="car-name">${car.name}</h1>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star checked"></span>
      <span class="fa fa-star"></span>
      <span class="fa fa-star"></span>
      <span class="number-of-reviews">${car.stars}</span>
      <div class="specific-info">
        <div>
          <img
            src="/imgs/svgs/person.svg"
            alt=""
            class="car-info-svg"
          />
          <p class="personNumber">${car.numOfSeats}</p>
        </div>
        <div>
          <img
            src="/imgs/svgs/briefcase.svg"
            alt=""
            class="car-info-svg"
          />
          <p class="bagage-number">${car.bagageSpace}</p>
        </div>

        <div>
          <img
            src="/imgs/svgs/gearshift.svg"
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
  <div class="carSpecs">
    ${specs}
  </div>`;
    a.appendChild(article);

    a.addEventListener("click", (e) => {
      localStorage.setItem(
        "purchCarName",
        e.currentTarget.dataset.purchcarname
      );
      localStorage.setItem(
        "purchCarBrand",
        e.currentTarget.dataset.purchcartype
      );
    });
    carsGridContainer.appendChild(a);
  });
};
const subscribeForm = document.getElementById("subscibeForm");

// checking if the user is logged in here the function is checking the cookie if you have a cookie do smth if not do
// this function will be called where i need it to check if the user
// is logged in ie: has cookie or not , ps: this function will be used after i check the session , if the session does not have id in it it means the user is not even logged in now so i will redirect him to the login page
const checkLoggedIn = () => {
  // Read the userId cookie
  const userId = getCookie("userId");

  if (userId) {
    // If the userId cookie is present, the user is logged in
    console.log(`Logged in as user with ID ${userId}`);
    return userId;
  } else {
    swal
      .fire({
        title: "You are not signed in do you want to sign in?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sign In",
        confirmButtonColor: "#0000FF",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          // Remove the userId from the session
          sessionStorage.removeItem("userId");

          // Remove the userId from the cookie
          document.cookie =
            "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          // Redirect the user to the login page
          window.location.href = "/login";
        }
      });
  }
};

const getCookie = (name) => {
  // Parse the cookie string to get the value of the specified cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

subscribeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let userId = sessionStorage.getItem("userId");
  if (userId) {
    console.log(userId);
  } else {
    userId = checkLoggedIn();
  }
  if (userId) {
    let email = document.getElementById("emailSubscribe").value;

    let id = parseInt(userId);
    fetch(baseUrl + "/subscribe", {
      method: "POST",
      body: JSON.stringify({ id, email }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status == 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "You are Now subscribed",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (response.status == 409) {
        Swal.fire("This user is already a subscriber");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    });
  }
});
