const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    main = 'partials/main_home';
    str = `<a href="login" class="color-navbar">
    <i class="fa fa-sign-in-alt"></i>
    <i class="fa fa-sign-in"></i> Login
</a>`;
    res.render('index',{main:main,str:str});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung