const express = require('express');
const router = express.Router();

const CategoryModel = require('../models/category_models');
var fs = require('fs');
//save path img
var path ='';
var path_img_item=[];
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

        if(file.mimetype != 'image/jpeg'&&file.mimetype != 'image/png')
        {
            return cb('File khong dung dinh dang');
        }
        else
        {
            let path_img ='avatar' + '-' + Date.now() + '-' + file.originalname;
            cb(null, path_img);
            path=path_img;
        }
    }
});

const storage_item = multer.diskStorage({
    //duong dan luu file
    destination: (req,file,cb)=>{
        cb(null,'public/uploads/uploads');
    },
    //kiem tra file
    filename: (req,file,cb)=>{

        if(file.mimetype != 'image/jpeg'&&file.mimetype != 'image/png')
        {
            return cb('File khong dung dinh dang');
        }
        else
        {
            let path_items = 'item' + '-' + Date.now() + '-' + file.originalname;
            cb(null, path_items);
            path_img_item.push(path_items);
        }
    }
});

var limits = {fileSize: 10240*50000}; // hieu la 200kb
// Gọi ra sử dụng
const upload = multer ({storage: storage, limits: limits}).single('img');
const uploads = multer ({storage: storage_item, limits: limits}).array('img');//array neu iput nhieu file, con 1 file thi single
router.post('/upload_file',(req,res)=>{

    //tạo folder save img upload
    if (!fs.existsSync('./public/uploads'))
        {
            fs.mkdirSync('./public/uploads');
            fs.mkdirSync('./public/uploads/uploads');
        }
    upload(req, res, function(err){
        
        if(path =='') 
        {
            res.send('No choosed Image');
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

router.post('/upload_sub_file',(req,res)=>{

    //tạo folder save img upload
    if (!fs.existsSync('./public/uploads'))
        {
            fs.mkdirSync('./public/uploads');
            fs.mkdirSync('./public/uploads/uploads');
        }
    uploads(req, res, function(err){
        
        if(path_img_item.length<1) 
        {
            res.send('No choosed Image');
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
            res.send(path_img_item);
        } 
        path_img_item=[];
    });
});

router.post('/SHOW_IMG',(req,res)=>{
    let c =[];
    fs.readdirSync("./public/uploads/uploads").forEach(file => {
        c.push("/public/uploads/uploads/"+file);
    });
    res.send(c);
})

router.get('/add_categories',(req,res)=>{
    main = 'categories/add_category_product';
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.get('/list_categories',(req,res)=>{
    main = 'categories/list_category_product';
    CategoryModel.find({status: false })
        .exec((err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(data);
                }
        });
    res.render('index',{main:main});//gui du lieu khi su dung ejs
});

router.post('/add_category_product',(req,res)=>{
    object = [
        {
            TYPE: req.body.TYPE,
            Group: req.body.Group,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            img: req.body.img,
            discription: req.body.describe,
        }
    ]
    CategoryModel.create(object,(err,data)=>{
        if(err)
        {
            console.log(err);
            res.send('err');
        }
        else
        {
            console.log(data);
            res.send('ok')
        }
    });
})

module.exports = router; //xuat ra du lieu de su dung