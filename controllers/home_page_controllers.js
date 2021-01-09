const express = require('express');
const router = express.Router();

var fs = require('fs');

router.get('/',(req,res)=>{
    main = 'partials/main_home';
    if (!fs.existsSync('./public/uploads'))
    {
        fs.mkdirSync('./public/uploads');
        fs.mkdirSync('./public/uploads/uploads');
    }
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung