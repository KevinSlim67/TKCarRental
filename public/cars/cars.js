const searchBtn = document.querySelector(".searchBtn");

const grid = document.getElementById("carsGridContainer");
const grid2 = document.getElementById("carsGridContainer2");

const gridPages = document.querySelector(".gridPages");
// get the values from local storage that you set from the home page search bar see main.js
let carBrand = localStorage.getItem("carBrand");
let carType = localStorage.getItem("carType");
let price = localStorage.getItem("price");
const baseUrl = "";

// first i load the cars (comming from the home ) then i have a event listener for the search btn that is inside the car page
let myLoadedArray = [];
loadCars();
searchBtn.addEventListener("click", () => {
  myLoadedArray = [];
  carBrand = document.getElementById("carBrandSelect").value;
  carType = document.getElementById("carTypeSelect").value;
  price = document.getElementById("carPriceSelect").value;
  loadCars();
});
// let myLoadedArray = [];
function loadCars() {
  grid.innerHTML = "";
  grid2.innerHTML = "";
  // empty the search type and brand if they have the values of any type or any brand and that is to use on filter of the array bellow

  if (carType == "Any Type" && carBrand == "Any Brand") {
    fetch(baseUrl + "/api/cars/all")
      .then((response) => response.json())
      .then((data) => {
        // Loop through the array
        data.forEach((item) => {
          item.info.url = `data:image/jpeg;base64,${item.imageData}`;

          myLoadedArray.push(item.info);
        });

        loadData();
      });
  } else if (carType === "Any Type" && carBrand != "Any Brand") {
    fetch(baseUrl + `/api/cars/${carBrand}`)
      .then((response) => response.json())
      .then((data) => {
        // Loop through the array
        data.forEach((item) => {
          item.info.url = `data:image/jpeg;base64,${item.imageData}`;

          myLoadedArray.push(item.info);
        });

        loadData();
      });
  } else if (carBrand === "Any Brand" && carType != "Any Type") {
    fetch(baseUrl + `/api/cars/bytype/${carType}`)
      .then((response) => response.json())
      .then((data) => {
        // Loop through the array
        data.forEach((item) => {
          item.info.url = `data:image/jpeg;base64,${item.imageData}`;

          myLoadedArray.push(item.info);
        });

        loadData();
      });
  } else {
    fetch(baseUrl + `/api/cars/byboth/${carBrand}/${carType}`)
      .then((response) => response.json())
      .then((data) => {
        // Loop through the array
        data.forEach((item) => {
          item.info.url = `data:image/jpeg;base64,${item.imageData}`;

          myLoadedArray.push(item.info);
        });

        loadData();
      });
  }
}

let loadData = function () {
  // now we sort the new array by price
  if (price === "Price Low To Hight") {
    myLoadedArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else {
    myLoadedArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  }

  // now i have my array as the search result and sorted

  // next step is to manipulate the dom and enter the elements in the cars page

  if (myLoadedArray.length === 0) {
    grid.innerHTML = `<i class="fa-solid fa-face-frown sorryFace"></i></i><h1 class="notFoundMessage">We are Sorry we did not find any car that matches your search</h1>`;
  } else {
    myLoadedArray.forEach((car) => {
      let a = document.createElement("a");
      a.setAttribute("href", "/purchaseCar");
      a.setAttribute("data-purchCarName", `${car.name}`);
      a.setAttribute("data-purchCarType", `${car.model}`);

      let article = document.createElement("article");
      article.classList.add("article");
      let inner = `<figure class="article__figure"><img class="article__cover" src=${
        car.url
      }>
        <figcaption class="article__caption">
          <h2 class="article__title">${car.name} ${car.model}</h2>
          <p class="article__info">this is a ${car.name} ${car.model} of type ${
        car.type
      } it has ${car.numOfSeats} seats and a bagage spacing of ${
        car.bagageSpace
      }, the transmission on this car is ${
        car.transmission
      } and it has the following specs: ${car.specs.toString()}.</p>
        </figcaption>
      </figure>
      <div class="car-info">
      <div class="informations">
       <h1 class="car-name">${car.name} ${car.model}</h1>
       <span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star"></span>
<span class="fa fa-star"></span>
<span class="number-of-reviews">${car.stars} reviews</span>
<div class="specific-info">
<div>
  <img src="/imgs/svgs/person.svg" alt="p" class="car-info-svg">
 <p class="personNumber">
   ${car.numOfSeats}
 </p>
</div>
<div>
  <img src="/imgs/svgs/briefcase.svg" alt="" class="car-info-svg">
  <p class="bagage-number">${car.bagageSpace}</p>
</div>

<div>
  <img src="/imgs/svgs/gearshift.svg" alt="" class="car-info-svg">
  <p class="tramission-type">${car.transmission}</p>
</div>
</div>
      </div>
      <div class="car-price">
        <h1 class="price">${car.price}</h1>
        <p>per day</p>
      </div>
      
      </div>`;

      article.innerHTML = inner;
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

      // console.log("hello" + grid.childElementCount);
      // now i will append childs on the grid deppending on how many children there is and ill use pages for that
      if (grid.childElementCount < 12) {
        grid.appendChild(a);
      } else {
        grid2.appendChild(a);
      }
    });
  }
  //  after the search in the array and appending childs see if the first grid is full so you can show the page buttons and make them function

  if (grid2.childElementCount === 0) {
    gridPages.classList.remove("active");
  } else {
    gridPages.classList.add("active");
    let pageButtons = document.querySelectorAll(".pages .page");
    let page1 = document.querySelector(".page1grid");
    let page2 = document.querySelector(".page2grid");
    let pageNumber = document.querySelector(".pageNumber");
    pageButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.currentTarget.classList.contains("page1grid")) {
          page1.classList.add("active");
          page2.classList.remove("active");
          grid.classList.add("active");
          grid2.classList.remove("active");
          pageNumber.innerHTML = "page 1 of 2";
        } else {
          page2.classList.add("active");
          page1.classList.remove("active");
          grid2.classList.add("active");
          grid.classList.remove("active");
          pageNumber.innerHTML = "page 2 of 2";
        }
      });
    });
  }
  // reset the local storage
  localStorage.setItem("carBrand", "Any Brand");
  localStorage.setItem("carType", "Any Type");
  localStorage.setItem("price", "Price Low To Hight");
};
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
const subscribeForm = document.getElementById("subscibeForm");

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
          title: "Oops....",
          text: "Something went wrong!",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    });
  }
});
