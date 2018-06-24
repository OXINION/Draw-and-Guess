const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const PostSchema = new Schema({
  title:{
    type:String,
    required: true
  },
  
  status: {
    type: String,
    default:'public'
  },
  allowComments: {
    type: Boolean,
    default:true
  },

  tel: {
    type: String,
    'default':'' 
  },
  longitude: {
    type: String,
    'default':'' 
  },
  latitude: {
      type: String,
      'default':'' 
  },
  intro: {
    type: String,
    'default':''
  },

  image:{data: Buffer, contentType: String},

  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentDate:{
      type: Date,
      default: Date.now
    },
    commentUser:{
      type: Schema.Types.ObjectId,
      ref:'users'
    }
  }],
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

// Create collection and add schema
mongoose.model('posts', PostSchema, 'posts');
