const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const axios = require('axios'); // for CommonJS syntax
const fetchAstronomyImages = async (startDate, endDate) => {
    const apiKey = process.env.APOD_API_KEY;
    const providedParams = {
      
        start_date: startDate,
        end_date: endDate,
       
    };

    // Construct the URL
    const apiUrl = 'https://api.nasa.gov/planetary/apod';
    
    try {
        const response = await axios.get(apiUrl, {
            params: {
                api_key: apiKey,
                ...providedParams,
            },
        });

        if (response.status !== 200) {
          console.log(response.msg)
            throw new Error('Error fetching data');
        }

        const data = response.data;
        return data
    } catch (error) {
        console.error('Error fetching data:1', error);
        // throw error;
    }
  }
module.exports = {
  getRegisteredUserSearch: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("registered-user-search", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
   fetchNasaImagesByDateRange: async (req, res) => { 
    console.log(req.user)
    try {

      const data = await fetchAstronomyImages(
        
        req.query.startDate,
        req.query.endDate,
       
      );
// console.log(data)
            
      if (data) {
        // console.log(data)
        res.render('fetch-nasa-images-by-date-range.ejs', { user: req.user, data: data });
      } else {
        // Handle the case when data is not available
        res.render('registered-user-search.ejs', { user: req.user});
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      // const posts = await Post.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
  
  },
  getFeed: async (req, res) => {

    try {
    
    
      res.render("feed.ejs", {  user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  editProfile: async (req, res) => {
    try {
      
      res.render("editprofile.ejs", {user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
