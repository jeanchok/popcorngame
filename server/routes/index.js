const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
});

// // setting headers to avoid CORS errors
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });

module.exports = router;