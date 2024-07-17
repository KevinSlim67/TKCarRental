// **********

// <NAVBAR>

// **********

export const hamburger = document.querySelector(".hamburger");
export const navMenu = document.querySelector(".nav-menu");
export const pageContainer = document.querySelector(".page-container");
export const exitnavBar = document.querySelector(".nav-menu .closeBtn");
export const navContact = document.querySelector(".nav-contact");
export const mainNavBar = document.querySelector(".main-navBar");
hamburger.addEventListener("click", () => {
  navMenu.classList.add("active");
  pageContainer.classList.add("blur");
});
exitnavBar.addEventListener("click", () => {
  navMenu.classList.remove("active");
  pageContainer.classList.remove("blur");
});

// make a clicking event on all the page unless it is the hamburger then you can remove the active
pageContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fa-bars")) {
    navMenu.classList.remove("active");
    pageContainer.classList.remove("blur");
  }
});
//even on window scroll to delete the top bar
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    navContact.classList.add("hide");
    mainNavBar.style.backgroundColor = "black";
  } else {
    navContact.classList.remove("hide");
    mainNavBar.style.backgroundColor = "rgba(0, 0, 0, 0.425)";
  }
});
