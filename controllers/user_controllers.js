const express = require('express');
const router = express.Router();

router.get('/user',(req,res)=>{
    main = 'users/list_user';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.get('/user/register',(req,res)=>{
    main = 'users/register';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.get('/login',(req,res)=>{
    main = 'users/login';
    str = `<a href="login" class="color-navbar">
    <i class="fa fa-sign-out-alt"></i>
    <i class="fa fa-sign-out"></i> Logout
</a>`;
    res.render('index',{main:main,str:str});//gui du lieu khi su dung ejs
});

router.get('/sign_up',(req,res)=>{
    main = 'users/sign_up_user';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.get('/forgot_password',(req,res)=>{
    main = 'users/forgot_password';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung