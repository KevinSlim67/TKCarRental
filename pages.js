const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home/index.html");
});
router.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/home/index.html");
});
router.get("/cars", (req, res) => {
  res.sendFile(__dirname + "/public/cars/cars.html");
});
router.get("/aboutUs", (req, res) => {
  res.sendFile(__dirname + "/public/aboutUs/aboutUs.html");
});
router.get("/contactUs", (req, res) => {
  res.sendFile(__dirname + "/public/contactUs/contactUs.html");
});
router.get("/faq", (req, res) => {
  res.sendFile(__dirname + "/public/faq/faq.html");
});
router.get("/gallery", (req, res) => {
  res.sendFile(__dirname + "/public/gallery/gallery.html");
});
router.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login/login.html");
});
router.get("/purchaseCar", (req, res) => {
  res.sendFile(__dirname + "/public/purchaseCar/purchaseCar.html");
});
router.get("/services", (req, res) => {
  res.sendFile(__dirname + "/public/services/services.html");
});
router.get("/signUp", (req, res) => {
  res.sendFile(__dirname + "/public/signUp/signUp.html");
});
router.get("/specificCars", (req, res) => {
  res.sendFile(__dirname + "/public/specificCars/specificCars.html");
});
module.exports = router;
