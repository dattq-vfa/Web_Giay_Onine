const express = require('express');
const router = express.Router();
//goi model
const UserModel = require('../models/user_models');

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
    str = `<a href="/" class="color-navbar">
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

router.post('/signup_user',(req,res)=>{
    let check=0;
    let err='';
    let name = (req.body.name).toUpperCase();
    let username = (req.body.username).replace(/\s+/g, ''); // \slà biểu thức chính cho "khoảng trắng" và glà cờ "toàn cầu", nghĩa là khớp với TẤT CẢ \s(khoảng trắng).
    let password = req.body.password;
    let email = req.body.Email; 
    let phone = req.body.phone;
    let address = req.body.address; 

    pattern_name = /^([a-zA-Z\sàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]){1,30}$/
    subject_name = name;
    pattern_username = /^([a-z]|[A-Z]){1,20}$/
    subject_username = username;
    pattern_pass = /^(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z!@#$%^&*.]{8,}$/ //?=.*[a-z] giống if sau đó thực hiện [0-9a-zA-Z!@#$%^&*.]{8,}
    subject_pass = password;
    // pattern_phone = /^0(3[2-9]|56|58|59|70|7[6-9]|8[1-6]|8[8-9]|)[0-9]{7}$/ //3[2-9] thay cho 32-39
    // subject_phone = phone;
    // pattern_email = /^([a-z,A-Z,0-9]){3,}\@gmail.(com|co)$/
    // subject_email = email;
    // (pattern_name.test(subject_name)) ? res.send(name.trim()): res.send('ng');
    // (pattern_username.test(subject_username)) ? check=check+1: err+='Please enter username again!'+'\n';
    (pattern_pass.test(subject_pass)) ? res.send(password.trim()): res.send('ng');
    // (pattern_phone.test(subject_phone)) ? check=check+1: err+='Please enter phone again!'+'\n';
    // (pattern_email.test(subject_email)) ? check=check+1: err+='Please enter email again!';




    // obj = {
    //     name: req.body.name,
    //     username: req.body.username,
    //     password: req.body.password,
    //     email: req.body.phone,
    //     phone: req.body.email,
    //     address: req.body.address,
    //     Role: [1,2]
    // }

    // UserModel.create(obj,(err,data)=>{
    //     if(err)
    //         {
    //             console.log(err);
    //             res.send('err');
    //         }
    //         else
    //         {
    //             console.log(data);
    //             res.send('ok')
    //         }
    //     });
});


module.exports = router; //xuat ra du lieu de su dung