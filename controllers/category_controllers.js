const express = require('express');
const router = express.Router();

//load multer
const multer = require('multer');
const CategoryModel = require('../models/category_models');
//goi localstorage
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./cratch');
//cau hinh bien
let path=[];
let link_avatar ='';
let link_items =[] ;
let dif_name='';
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
            CategoryModel.find({name: req.body.name})
            .exec((err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    if(data.length<1)
                    {
                        // file.fieldname +  upload.any() để lấy tên file hình
                        if(file.fieldname == 'img')
                        {
                            let path_img ='avatar'+ '-' +  req.body.name + '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_avatar = path_img;
                            path.push("avatar");
                        }
                        else
                        {
                            let path_img ='item'+ '-' + req.body.name + '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_items.push(path_img);
                            path.push("items");
                        }
                    }
                    else 
                    {
                        dif_name = 'err';
                    }
                }
            });
        }
    }
});

var limits = {fileSize: 1024*5000}; // hieu la 200kb
// Gọi ra sử dụng
var upload = multer({storage: storage, limits: limits });

router.post('/upload_file',(req,res)=>{
    if(dif_name != 'err')
    {
        // upload image and handle err
        upload.any()(req, res, function(err){
            
            if(path.length < 1) 
            {
                res.send('No choosed Image');
            }
            else if(err instanceof multer.MulterError)
            {
                (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
            }
            else if(err) 
            {
                res.send(err);
            }
            else
            {
                if(path.indexOf("avatar") == -1) res.send("No choosed Image Avatar");
                else if(path.indexOf("items") == -1) res.send("No choosed Image Items");
                else 
                {
                    obj = [
                        {
                            TYPE: req.body.TYPE,
                            Group: req.body.Group,
                            name: req.body.name,
                            price: req.body.price,
                            quantity: req.body.quantity,
                            discription: req.body.content,
                            img: link_avatar,
                            imgs: link_items,
                            id_category: localStorage.getItem('id_user')
                        }
                    ];
                    CategoryModel.create(obj,(err,data_token)=>{
                        if(err)
                        {
                            res.send('err create token');
                        }
                        else
                        {
                            res.send("ok");
                        }
                    });
                }
            }
            path =[];
        });
    }
    else
    {
        dif_name='';
        res.send('Name already exists');
    }
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