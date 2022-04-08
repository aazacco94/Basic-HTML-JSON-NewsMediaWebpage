const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required:true
  },
  date:{
    type: String,
    required: true
  },
  public:{
    type: Boolean,
    required:true
  },
  content:{
    type: String,
    required: true
  }
});

const ArticleModel = mongoose.model("Articles", ArticleSchema);

module.exports = ArticleModel;