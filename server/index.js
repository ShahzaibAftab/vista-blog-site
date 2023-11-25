require('./config.js'); 
require('./schema/user.js');
require('./schema/blog.js');

const express = require("express");
const cors=require('cors')
const userController = require('./controllers/userController.js');
const blogController=require('./controllers/blogController.js')

const app = express();
const PORT = 5000;

const corsOptions = {
    origin: 'http://localhost:5500',
    credentials: true,
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get("/", (req, res) => {
//     console.log('Server test');
//     res.send('Server test');
// });

app.use('/user', userController);
app.use('/request', blogController);

app.listen(PORT, () => console.log("Server running on port " + PORT));
