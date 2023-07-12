const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
  title: { 
    type: String,
    required: true 
  },
  icon: { 
    type: String,
  }
},
{ timestamps: false },
)

const categoryModel = mongoose.model('category', CategorySchema)
module.exports = categoryModel