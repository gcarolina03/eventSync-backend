const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const cloudinary = require('../../db/cloudinary')


const signup = async (req, res) => {
  try {
    const email = req.body.email
    console.log(req.body)

    const user = await User.findOne({ email })

    if (user) {
    return res.status(200).json('exist');
    } else {
      // password is encrypted
      req.body.password = bcrypt.hashSync(req.body.password, 10)

       // Check if an avatar file was uploaded
       console.log(req.file)
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        console.log(result)
        req.body.img_url = result.secure_url;
      }

      // user is created
      const user = new User(req.body)
      await user.save()
      // create a JSON Web Token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.status(200).json({ token })
    }
  } catch (err) {
    return res.status(500).send({ err, message: 'User not created!' })
  }
}

const login = async (req,res) => {
  try {
    const email = req.body.email
    // search user with email
    const user = await User.findOne({ email })
    // user not exist, return error
    if (!user) { return res.status(200).send('incorrect') }

    // compare encrypted password
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      // password is not the same, return error
      if (err || !result) { return res.status(200).send('incorrect') }
      
      //ok! create a JSON Web Token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return res.status(200).json({ token })
    })
  } catch (err) {
    return res.status(500).send({ err, message: 'Failed to login!' })
  } 
}

module.exports = { signup , login }