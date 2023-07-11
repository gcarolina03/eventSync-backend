const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitySchema = new Schema({
  name: { 
    type: String,
    required: true 
  },
  postal_code: { 
    type: Number,
    required: true,
    unique: true
  },
  country: { 
    type: String,
    required: true,
  },
},
{ timestamps: false },
)

const cityModel = mongoose.model('city', CitySchema)
module.exports = cityModel