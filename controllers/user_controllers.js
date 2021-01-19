const express = require('express');
const router = express.Router();

//load bcrypt 
const bcrypt = require('bcrypt');
//goi model
const UserModel = require('../models/user_models');
const TokenModel = require('../models/token_models');

//goi jwt
const jwt = require('jsonwebtoken');
//goi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./cratch');

var link = {home:'',category:'',user:''};

router.get('/user',(req,res)=>{
    main = 'users/list_user';
    link.user = 'active';
    res.render('index',{main:main , link: link});//gui du lieu khi su dung ejs
});

router.get('/user/register',(req,res)=>{
    main = 'users/register';
    link.user = 'active';
    res.render('index',{main:main, link:link});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung