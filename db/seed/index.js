require("dotenv").config();
const mongoose = require("mongoose");
const { connectToDatabase, disconnectToDatabase } = require("..");
const Category = require("../../api/models/category.model");
const User = require("../../api/models/user.model");
const categoriesData = require("../seed/test.categories.json");
const usersData = require("../seed/test.users.json");

const insertConfig = async () => {
  try {
    await connectToDatabase( );

    await Category.deleteMany({});
    console.log("All categories deleted");

    await User.deleteMany({});
    console.log("All users deleted");

    await Category.insertMany(categoriesData);
    console.log("Categories inserted successfully");

    await User.insertMany(usersData);
    console.log("Users inserted successfully");

    await disconnectToDatabase();
  } catch (err) {
    console.error("Error inserting configuration data:", err);
    await disconnectToDatabase();
  }
};

insertConfig();
