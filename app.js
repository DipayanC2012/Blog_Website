//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongooose=require("mongoose");

const homeStartingContent = "Management Information Systems (MIS) is the study of people, technology, organizations, and the relationships among them. MIS professionals help firms realize maximum benefit from investment in personnel, equipment, and business processes. MIS is a people-oriented field with an emphasis on service through technology. If you have an interest in technology and have the desire to use technology to improve people’s lives, a degree in MIS may be for you.";
const aboutContent = "The team for this project consists of Dipayan Chakraborty, Ehtheshamul Haque, Anand Krishnan S and Mansi Ganothra. Dipayan has been the lead developer and back-end developer for the project. Ehtheshamul has led the front end development. Anand and Mansi have helped the development process by acting as product managers. Dipayan Chakraborty-1RV20EI010, Mansi Ganothra- 1RV20EE030, Anand Krishnan S- 1RV20EI003, Ehteshamul Haque - 1RV20EI012";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const posts=[];
const _=require('lodash');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongooose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema={
  title: String,
  content: String
};

const BlogPost=mongooose.model("BlogPost", postSchema);

app.get("/", function(req, res){

  BlogPost.find({}, function(err, foundPosts){
    if(!err){
      res.render("home",{startingContent: homeStartingContent, posts:foundPosts})
    }
  })
})

app.get("/about", function(req, res){
  res.render("about",{about:aboutContent})
})

app.get("/contact", function(req, res){
  res.render("contact",{contact:contactContent})
})

app.get("/compose", function(req, res){
  res.render("compose")
})

app.post("/compose", function(req, res){

    postTitle=req.body.newTitle;
    postContent=req.body.newPost;

  const post=new BlogPost({
      title: postTitle,
      content: postContent
  });
  post.save();

  res.redirect("/");
})
app.post("/delete", function(req, res){

  var toBeDeletedTitle=req.body.postTitle;
  console.log(toBeDeletedTitle)

  BlogPost.findByIdAndDelete(toBeDeletedTitle.trim(), function(err,docs){
    if(err){
      console.log(err);
    }else{
      console.log("post deleted", docs);
      res.redirect("/");
    }
  })

})

app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    BlogPost.findOne({_id: requestedPostId}, function(err, post){

      res.render("post", {
        title: post.title,
        content: post.content,
        id: requestedPostId
      });
    });
  
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
