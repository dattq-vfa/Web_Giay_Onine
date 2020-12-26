const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    main = 'partials/main_home';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung