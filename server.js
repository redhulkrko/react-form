
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const path = require('path')
const app = express();
require("./config");

app.use(bodyParser.json());
app.use(cors());

// API
const apiRouter = express.Router();
const movieRoutes = require('./routes/movie');
app.use("/api", apiRouter);
apiRouter.use("/movies", movieRoutes);
// app.use(express.static(path.join(__dirname, '../build')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../build'))
// })

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
