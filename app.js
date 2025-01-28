const express = require("express");
const handlerErrors = require("./middlewares/handlerErrors");
const moviesRouter = require("./routers/movies");
const notFoundRoute = require("./middlewares/notFoundRoute");
const cors = require("cors");

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.static("public"));

app.use(express.json()); 

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use("/movies", moviesRouter);



app.use(handlerErrors);

app.use(notFoundRoute);

app.listen(port, () => { 
    console.log(`Il server è partito al ${port} port`)
});