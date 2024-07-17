const baseUrl = "";
console.log("hello from oboutUS");
const myFormContainer = document.querySelector(".formContainer");
const myForm = document.getElementById("myForm");
window.addEventListener("scroll", () => {
  if (myFormContainer.getBoundingClientRect().top < -7) {
    myForm.style.transform = "translateY(-3rem)";
  } else {
    myForm.style.transform = "translateY(3rem)";
  }
});
let teamCarouselUl = document.getElementById("teamCarouselUl");
loadTeam();
function loadTeam() {
  const track = document.querySelector(".carousel__track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel__button--right");
  const prevButton = document.querySelector(".carousel__button--left");
  const dotsNav = document.querySelector(".carousel__nav");
  const dots = Array.from(dotsNav.children);
  const slideWidth = slides[0].getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  }); // just to move each slide to the left the width of the first slide width

  const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = `translateX(-${targetSlide.style.left})`;
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
  };
  const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove("current-slide");
    targetDot.classList.add("current-slide");
  };

  const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
    if (targetIndex === 0) {
      prevButton.classList.add("is-hidden");
      nextButton.classList.remove("is-hidden");
    } else if (targetIndex === slides.length - 1) {
      prevButton.classList.remove("is-hidden");
      nextButton.classList.add("is-hidden");
    } else {
      prevButton.classList.remove("is-hidden");
      nextButton.classList.remove("is-hidden");
    }
  };

  nextButton.addEventListener("click", () => {
    const currentSlide = track.querySelector(".current-slide");
    const nextSlide = currentSlide.nextElementSibling;
    moveToSlide(track, currentSlide, nextSlide);
    const currentDot = dotsNav.querySelector(".current-slide"); // cz the current-slide will be updated on the dots also
    const nextDot = currentDot.nextElementSibling;
    updateDots(currentDot, nextDot); // the next dot will take the current dot cz we are moving next here
    const nextIndex = slides.findIndex((slide) => slide === nextSlide);

    hideShowArrows(slides, prevButton, nextButton, nextIndex);
  });
  prevButton.addEventListener("click", () => {
    const currentSlide = track.querySelector(".current-slide");
    const prevSlide = currentSlide.previousElementSibling;
    moveToSlide(track, currentSlide, prevSlide);
    const currentDot = dotsNav.querySelector(".current-slide");
    const prevDot = currentDot.previousElementSibling;
    updateDots(currentDot, prevDot);
    const prevIndex = slides.findIndex((slide) => slide === prevSlide);
    hideShowArrows(slides, prevButton, nextButton, prevIndex);
  });

  // the dots i gave them one listener
  dotsNav.addEventListener("click", (e) => {
    // what we clicked on
    const targetDot = e.target.closest("button");
    if (!targetDot) return; // if when i click its not on a button just stop  and get out
    const currentSlide = track.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-slide"); // cz dots also have current slide class
    const targetIndex = dots.findIndex((dot) => dot === targetDot);
    // this ubove means findIndex is like a loop im seach for each dot search and return only the index of the dot that is equal to targetDot
    const targetSlide = slides[targetIndex];
    moveToSlide(track, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
    hideShowArrows(slides, prevButton, nextButton, targetIndex);
  });
}

const subscribeForm = document.getElementById("subscibeForm");

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

const form = document.querySelector("#myForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const subject = document.querySelector("#subject").value;
  const message = document.querySelector("#message").value;

  const response = await fetch(baseUrl + "/contact/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      subject,
      message,
    }),
  }).then((res) => {
    if (res.status == 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your Message is Sent!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(submit, 2000);
    } else if (res.status == 400) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please Try again later",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  });
});
let submit = function () {
  form.submit();
};
