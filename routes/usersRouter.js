const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController')

router.get('/', function (req, res) {
    res.send("hey it's running")
});


router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

module.exports = router;


// if we will not define destruct var and if we use that var so our application will crash
// so we add try catch block