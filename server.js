const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require("./middleWare/errorMiddleware")
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const categoryRoute = require("./routes/categoryRoute")
const itemRoute = require("./routes/itemRoute");
const cookieParser = require('cookie-parser');
const path = require("path");

const app = express();


//Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes Middelware

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/items", itemRoute);
app.use("/api/cart", cartRoute);
app.use("/api/categories", categoryRoute);


//Routes

app.get("/", (req, res) => {
    res.send("Home Page");
})

const PORT = process.env.PORT || 5000;

// Error handlers

app.use(errorHandler);


//connect to mongodb and start server

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT} `)
        })
    })
    .catch((err) => {
        console.log(err)
    })