// **********

// <NAVBAR>

// **********

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const pageContainer = document.querySelector(".page-container");
const exitnavBar = document.querySelector(".nav-menu .closeBtn");
const navContact = document.querySelector(".nav-contact");
const mainNavBar = document.querySelector(".main-navBar");
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
