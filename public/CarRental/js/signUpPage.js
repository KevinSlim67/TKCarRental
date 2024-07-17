import { btnEl } from "./buttons.js";
const baseUrl = "";
const backToLogin = document.querySelector(".login-box .fa-arrow-left");
backToLogin.addEventListener("click", () => {
  window.location = "/login";
});
const form = document.querySelector("#form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the form from being submitted until validation is complete
  validateForm();
});
function validateForm() {
  // Get the values of the form fields
  const fullName = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate the full name field
  if (!fullName) {
    // Full name is required
    displayError("Full name is required");
    return;
  }
  if (/\d/.test(fullName)) {
    // Full name cannot contain numbers
    displayError("Full name cannot contain numbers");
    return;
  }

  // Validate the phone field
  if (!phone) {
    // Phone is required
    displayError("Phone is required");
    return;
  }
  if (!/^(\+\d+|\d+|\d{3}-\d{2}-\d{4})$/.test(phone)) {
    // Phone must contain only numbers, a plus sign, or be in the format "921-12-2134"
    displayError(
      'Phone must contain only numbers, a plus sign, or be in the format "921-123-2134"'
    );
    return;
  }

  // Validate the email field
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

  // Validate the confirm password field
  if (password !== confirmPassword) {
    // Passwords must match
    displayError("Passwords do not match");
    return;
  }

  // If all validation checks pass, submit the form
  fetch(baseUrl + "/form/form-submission", {
    method: "POST",
    body: JSON.stringify({ fullName, phone, email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status == 401) {
      displayError("email already exits feel free to login");
    } else if (response.status == 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Sign Up successfull",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(submit, 3000);
    }
  });
  let submit = function () {
    form.submit();
  };

  // form.submit();
}
// .then((response) => response.text())
//     .then((data) => {
//       console.log(response.status); // log the response from the backend
//     });
// Display an error message
function displayError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.innerText = message;
  setTimeout(() => {
    errorContainer.innerText = "";
  }, 3000);
}

const signUpBtn = document.querySelector(".signUpBtn");

signUpBtn.addEventListener("click", () => {
  window.location = "/login";
});
