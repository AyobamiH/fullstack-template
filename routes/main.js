const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

// const fetchAstronomyImagescontroller = require("../controllers/fetchAstronomyImagesController") // Import the function
// console.log(fetchAstronomyImagescontroller.fetchAstronomyImages())
//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/feedback", homeController.getFeedback);
router.get("/about", homeController.getAbout);
router.get("/thankyou", homeController.getThankyou)
router.get("/disclaimer", homeController.getDisclaimer)
router.get("/registered-user-search", ensureAuth, postsController.getRegisteredUserSearch);
router.get("/fetchNasaImagesByDateRange", ensureAuth, postsController.fetchNasaImagesByDateRange)
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/profile/editprofile", ensureAuth, postsController.editProfile);

module.exports = router;
