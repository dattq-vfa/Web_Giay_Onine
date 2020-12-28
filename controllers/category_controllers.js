const express = require('express');
const router = express.Router();

var fs = require('fs');
//save path img
var path =[];
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
            cb(null, Date.now() + '-' + file.originalname);
            path.push(Date.now() + '-' + file.originalname);
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
        
        if(path.length<1) 
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
        path=[];
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
            image: req.body.image,
            discription: req.body.describe,
            address: address,
            Role: [1,2],
        }
    ]
    UserModel.create(object,(err,data)=>{
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