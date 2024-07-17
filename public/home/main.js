const baseUrl = "";

// search bar in main page
const mainSearchBtn = document.getElementById("searBtnMain");

mainSearchBtn.addEventListener("click", passValue);

// handel send a message button
document.querySelector(".contactUsBtn").addEventListener("click", () => {
  window.location.href = "/contactUs";
});

let carByNameList = document.getElementById("carByNameUl");
loadCarsByName();
function loadCarsByName() {
  fetch(baseUrl + "/api/cars/carByName/all")
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((item, index) => {
        let list = document.createElement("li");
        list.classList.add("list-item");
        let imageDiv = document.createElement("div");

        let url = `data:image/jpeg;base64,${item.imageData}`;

        imageDiv.classList.add("grid-item-image");
        // imageDiv.classList.add(`car-img-${index + 1}`);
        imageDiv.style.backgroundImage = `url(${url})`;

        let a = document.createElement("a");
        a.href = "/specificCars";
        a.classList.add("grid-item", "item-by-name");

        a.setAttribute("data-value", item.name);
        if (item.name == "Mini Cooper") {
          a.setAttribute("data-value", "Mini");
        }

        a.appendChild(imageDiv);
        a.innerHTML += `
    <div class="grid-item__hover"></div>
    <div class="grid-item__name">${item.name}</div>
    <div class="grid-item__fixedName"><h3>${item.name}</h3></div>
`;
        list.appendChild(a);
        carByNameList.appendChild(list);
      });
      sendName();
    });
}
let carBytypeUl = document.querySelector(".list-by-type-search");
loadCarsByType();
function loadCarsByType() {
  fetch(baseUrl + "/api/cars/carByType/all")
    .then((Response) => Response.json())
    .then((data) => {
      data.forEach((item) => {
        let list = document.createElement("li");
        list.classList.add("list-item");
        let imageDiv = document.createElement("div");

        let url = `data:image/jpeg;base64,${item.imageData}`;

        imageDiv.classList.add("grid-item-image");
        // imageDiv.classList.add(`car-img-${index + 1}`);
        imageDiv.style.backgroundImage = `url(${url})`;
        let a = document.createElement("a");
        a.href = "/specificCars";
        a.classList.add("grid-item", "item-by-type");
        a.setAttribute("data-type", item.name);
        a.appendChild(imageDiv);
        a.innerHTML += `<div class="grid-item__hover"></div>

              <div class="grid-item__fixedName naming-by-type">
                <h3>${item.name}</h3>
              </div>`;
        list.appendChild(a);
        carBytypeUl.appendChild(list);
      });
      sendtype();
    });
}
// here i am sending values from the search bar to the local lstorage so i can get them in the ca page

function passValue() {
  let carBrand = document.getElementById("carBrandSelect");
  let Brandvalue = carBrand.value;
  // var text = carType.options[carType.selectedIndex].text;
  let carType = document.getElementById("carTypeSelect");
  let TypeValue = carType.value;

  let price = document.getElementById("carPriceSelect");
  let priceValue = price.value;

  localStorage.setItem("carBrand", Brandvalue);
  localStorage.setItem("carType", TypeValue);
  localStorage.setItem("price", priceValue);

  return false;
}

// here we are working on getting the items by name from the home oage on click i will get the value of the car name and throw this value to the local lstorage to catch it in the specific car.js where i will load the cars based on the name of the car clicked in home page

function sendName() {
  let itemsByName = document.querySelectorAll(".item-by-name");
  itemsByName.forEach((item) => {
    item.addEventListener("click", (e) => {
      localStorage.setItem("spCarName", e.currentTarget.dataset.value);
      localStorage.setItem("spCarType", "none");
    });
  });
}

// now i will send the type if one of the car by type pics in home was clicked
function sendtype() {
  let itemsByType = document.querySelectorAll(".item-by-type");
  itemsByType.forEach((item) => {
    item.addEventListener("click", (e) => {
      localStorage.setItem("spCarType", e.currentTarget.dataset.type);
      localStorage.setItem("spCarName", "none");
    });
  });
}

//make the video load only on bigger screen

// the idea is to provide the src only on bigger screens
const videoLocation = document.getElementById("background-video");

window.onload = videoSource(
  videoLocation,
  "https://assets.codepen.io/6093409/river.mp4"
);
function videoSource(element, vsrc) {
  if (window.innerWidth > 992) {
    const source = document.createElement("source");
    source.src = vsrc;
    source.type = "video/mp4";
    element.appendChild(source);
  }
}

const logoutBtns = document.querySelectorAll(".logoutBtn");
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
logoutBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Check if the user is logged in by checking for the userId in the session or cookie
    const userId = sessionStorage.getItem("userId") || getCookie("userId");

    if (userId) {
      // User is logged in, show the confirm dialog
      swal
        .fire({
          title: "Are you sure you want to log out?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Log out",
          confirmButtonColor: "#d33",
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
    } else {
      // User is not logged in, show the login dialog
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
  });
});
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
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    });
  }
});
const checkLoggedIn = () => {
  // Read the userId cookie
  const getCookie = (name) => {
    // Parse the cookie string to get the value of the specified cookie
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  };
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
