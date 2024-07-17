const btnEl = document.querySelectorAll(".btnRipple");

btnEl.forEach((btn) => {
  btn.addEventListener("mouseover", (e) => {
    // console.log(e.pageY - btnEl.offsetTop);// e.pageY give a number representing the y position of mouse now i will substract the offsetTop from it so the y will start from the top of the bottom

    const x = e.pageX - btn.getBoundingClientRect().left;
    const y = e.pageY - absoluteOffset(btn);
    // const xBar = e.pageX - btn.offsetLeft;
    // const yBar = e.pageY - btn.offsetTop;

    btn.style.setProperty("--xPos", x + "px");
    btn.style.setProperty("--yPos", y + "px");
  });
});
function absoluteOffset(el) {
  let offset = el.offsetTop;
  let offsetParent = el.offsetParent;
  if (offsetParent === document.body) {
    return offset;
  }
  return offset + absoluteOffset(offsetParent);
}
function absoluteOffsetLeft(el) {
  let offset = el.offsetLeft;
  let offsetParent = el.offsetParent;
  if (offsetParent === document.body) {
    return offset;
  }
  return offset + absoluteOffset(offsetParent);
}

const baseUrl = "";
const signUpBtn = document.querySelector(".signUpBtn");
document.getElementById("backToHomeArrow").addEventListener("click", () => {
  window.location.href = "/";
});
const getCookie = (name) => {
  // Parse the cookie string to get the value of the specified cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};
if (getCookie("userId")) {
  window.location.href = "/";
}

signUpBtn.addEventListener("click", () => {
  window.location.href = "/signUp";
});
const form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from being submitted until validation is complete
  validateForm();
});

function validateForm() {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;
  if (!email) {
    // Email is required
    displayError("Email is required");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    // Email must be in the format "example@domain.com"
    displayError('Email must be in the format "example@domain.com"');
    return;
  }

  // Validate the password field
  if (!password) {
    // Password is required
    displayError("Password is required");
    return;
  }
  if (!/\d/.test(password) || !/[A-Z]/.test(password)) {
    // Password must contain at least one number and one uppercase character
    displayError(
      "Password must contain at least one number and one uppercase character"
    );
    return;
  }
  fetch(baseUrl + "/form/form-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 401) {
        // If the status code is 401 Unauthorized, display the error message
        console.log("Invalid email or password");
        displayError("Invalid email or password");
      } else {
        // If the status code is not 401, parse the response as JSON
        return response.json();
      }
    })
    .then((data) => {
      if (data && data.userId) {
        // Login was successful, store the user ID in a cookie or local storage
        // to keep the user logged in
        const keepLoggedIn = document.getElementById("keepLoggedIn").checked;
        if (keepLoggedIn) {
          // Set the expiration date to one year from now
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          // Set the cookie with the user ID and the expiration date
          document.cookie = `userId=${
            data.userId
          }; expires=${expirationDate.toUTCString()}`;
        } else {
          sessionStorage.setItem("userId", data.userId);
        }

        window.location.href = "/";
      }
    });
}

// Display an error message
function displayError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerText = message;
  setTimeout(() => {
    errorContainer.innerText = "";
  }, 3000);
}
