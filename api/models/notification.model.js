const mongoose = require('mongoose');

const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    equired: true
  },
  message: { 
    type: String,
    required: true
  },
  data: {
    type: Object
  },
  read: { 
    type: Boolean,
    default: false 
  },
}, { 
  timestamps: true 
})

const notificationModel = mongoose.model('notification', NotificationSchema)
module.exports = notificationModel