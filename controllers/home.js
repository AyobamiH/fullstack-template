module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },

  getFeedback: (req, res) => {
    res.render("feedback.ejs");
  },

  getThankyou: (req, res) => {
    res.render("thankyou.ejs")
  },
  
  getAbout: (req, res) => {
    res.render("about.ejs")
  },

  getDisclaimer: (req, res)=>{
    res.render("disclaimer.ejs")
  }
};
