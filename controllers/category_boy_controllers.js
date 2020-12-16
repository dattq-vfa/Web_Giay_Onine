const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    main = 'partials/main_home';
    // bang = '<span style="color:red">hello_bang</span>';
    // obj = {
    //     name: 'teo',
    //     age: 18
    // }
    // mang = [
    //     {
    //         name: 'vu',
    //         age: 1
    //     },
    //     {
    //         name: 'as',
    //         age: 2
    //     },
    //     {
    //         name: 'kk',
    //         age: 3
    //     }
    // ]
    // res.send('xin chao');
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung