const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
//const { createTokens, validateToken } = require("./middlewares/AuthMiddleware");


app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = require('./models');


//Routers
const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);
const jobsRouter = require("./routes/Jobs");
app.use("/jobs", jobsRouter);
const applicationsRouter = require("./routes/Applications");
app.use("/applications", applicationsRouter);
const wishlistsRouter = require("./routes/Wishlists");
app.use("/wishlists", wishlistsRouter);


db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server running on port 3001");
    });

}).catch((err) => {
    console.log(err);
});