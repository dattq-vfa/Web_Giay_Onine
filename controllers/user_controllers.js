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
    res.render('index',{main:main});//gui du lieu khi su dung ejs
})

module.exports = router; //xuat ra du lieu de su dung