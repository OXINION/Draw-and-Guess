const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var btoa = require('btoa');



// Post pages
router.get('/', (req, res) => {
  Post.find({status:'public'})
    .populate('user')
    .sort({data:'desc'})
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    });
});

// Show one post
router.get('/show/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
  .populate('user')
  .populate('comments.commentUser')
  .then(post => {
    post.imagedata = btoa(post.image.data)
    if(post.status == 'public'){
      res.render('posts/show', {
        post: post
      });
    } else {
      if(req.user) {
        if(req.user.id == post.user._id){
          res.render('posts/show', {
            post: post
          });
        } else {
          res.redirect('/posts');
        }
      } else {
        res.redirect('/posts');
      }
    }
  });
});

// List posts from a user
router.get('/user/:userId', (req, res) => {
  Post.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    })
});

// Logged in user for the post
router.get('/my/', (req, res) => {
  Post.find({user: req.user.id})
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    })
});

// Analytics
router.get('/analytics/:id', (req, res) => {
  res.render('posts/analytics');
});



// Add Post Form
router.get('/add', (req, res) => {
  res.render('posts/add');
});

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('image');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Edit post Form for the user 
router.get('/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
  .then(post => {
    if(post.user != req.user.id){
      res.redirect('/posts');
    } else {
      res.render('posts/edit', {
        post: post
      });
    }
  });
});

// Process Add Post
router.post('/', upload, (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newPost = {
    title: req.body.title,
    status: req.body.status,
    allowComments:allowComments, 
    tel: req.body.tel,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    intro: req.body.intro,
    image: {
      data: fs.readFileSync(req.file.path),
      contentType: req.file.mimetype
              },
    user: req.user.id
  }

  // Create Post
  new Post(newPost)
    .save()
    .then(post => {
      res.redirect(`/posts/show/${post.id}`);
    });
  });

// Edit Form Process
router.put('/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  })
  .then(post => {
    let allowComments;
    
    if(req.body.allowComments){
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.tel = req.body.tel;
    post.longitude = req.body.longitude;
    post.latitude = req.body.latitude;
    post.intro = req.body.intro;
    
    post.save()
      .then(post => {
        res.redirect('/dashboard');
      });
  });
});

// Delete post
router.delete('/:id', (req, res) => {
  Post.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/dashboard')
    });
});

// Add Comment
router.post('/comment/:id', (req,res) => {
  Post.findOne({
    _id: req.params.id
  })
  .then(post => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }


    post.save()
      .then(post => {
        res.redirect(`/posts/show/${post.id}`);
      });
  });
});



module.exports = router;

