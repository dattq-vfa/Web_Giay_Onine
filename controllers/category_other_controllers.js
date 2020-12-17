const express = require('express');
const router = express.Router();

router.get('/admin/categories/other',(req,res)=>{
    main = 'categories/other_product';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung