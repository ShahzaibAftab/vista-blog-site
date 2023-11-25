const mongoose= require('mongoose')
const db = 'mongodb://127.0.0.1:27017/vistadb';


mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });