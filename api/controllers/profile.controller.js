const showProfile = async (req, res) => {
  try {
    return res.json( res.locals.user )
  } catch (err) {
    return res.status(404).send('Error: User not found') 
  }
}

module.exports = { showProfile }