const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');


router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  Post.find({user:req.user.id})
  .then(posts => {
    res.render('index/dashboard', {
      posts: posts
    });
  }); 
});



module.exports = router;

