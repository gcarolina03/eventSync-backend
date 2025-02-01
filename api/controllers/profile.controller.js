const showProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: res.locals.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error fetching user profile",
    });
  }
};

module.exports = { showProfile };
