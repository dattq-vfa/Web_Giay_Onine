const express = require('express');
const router = express.Router();

var fs = require('fs');
//save path img
var path = '';
//load multer
const multer = require('multer');
//cau hinh luu file
const storage = multer.diskStorage({
    //duong dan luu file
    destination: (req,file,cb)=>{
        cb(null,'public/uploads/uploads');
    },
    //kiem tra file
    filename: (req,file,cb)=>{
        
        //3 truong hop upload anh
        //--1 : anh khong duoc trung ten :su dung Date.now()
        //--2 : kiem tra đuôi ảnh (.jpg or png)
        //--3 : dung lượng của tấm ảnh 

        if(file.mimetype != 'image/jpeg'&&file.mimetype != 'image/png')
        {
            return cb('File khong dung dinh dang');
        }
        else
        {
            cb(null, Date.now() + '-' + file.originalname);
            path += Date.now() + '-' + file.originalname +' ';//them cho nay de lay ten file, hoac req.files de lay chi tiet tat ca file
        }
    }
});
var limits = {fileSize: 1024*5000}; // hieu la 200kb
// Gọi ra sử dụng
const uploads = multer ({storage: storage, limits: limits}).array('img');//array neu iput nhieu file, con 1 file thi single
router.post('/upload_file',(req,res)=>{

    //tạo folder save img upload
    if (!fs.existsSync('./public/uploads'))
        {
            fs.mkdirSync('./public/uploads');
            fs.mkdirSync('./public/uploads/uploads');
        }
    uploads(req, res, function(err){
        
        if(path=='') 
        {
            path='No choosed Image';
        }
        if(err instanceof multer.MulterError)
        {
           res.send("File quá lớn"); 
        }
        else if(err) 
        {
            res.send(err);
        }
        else
        {
            res.send(path);
        } 
        path='';
    });
});
router.post('/SHOW_IMG',(req,res)=>{
    let c =[];
    fs.readdirSync("./public/uploads/uploads").forEach(file => {
        c.push("/public/uploads/uploads/"+file);
    });
    res.send(c);
})

router.get('/categories',(req,res)=>{
    main = 'categories/category_product';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

module.exports = router; //xuat ra du lieu de su dung