const mongoose = require('mongoose')
const Schema = mongoose.Schema
var DateOnly = require('mongoose-dateonly')(mongoose)


const RequestSchema = new Schema({
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  state: {
    type: String,
    required: true
  },
  date_of_request: {
    type: DateOnly,
    required: true
  }
},
{ timestamps: false },
)

ReviewSchema.index({ serviceId: 1, eventId: 1 }, { unique: true });
const requestModel = mongoose.model('request', RequestSchema)
module.exports = requestModel