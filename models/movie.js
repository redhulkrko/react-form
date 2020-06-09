const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  synopsis: {
    type: String,
  },
  trailer: {
    type: String,
  },  
  poster: {
    type: String,
  },  
  slide: {
    type: String,
  },
  OpeningDate: {
    type: String,
  }
});

module.exports = movie = mongoose.model('movie', MovieSchema);
