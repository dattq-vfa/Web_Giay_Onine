const express = require('express');
const router = express.Router();

router.get('/admin/categories/child',(req,res)=>{
    main = 'categories/child_product';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung