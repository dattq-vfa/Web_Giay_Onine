const express = require('express');
const router = express.Router();

var fs = require('fs');
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
                    if(data.length<1 || req.body.e_form == 'e_form')
                    {
                        // file.fieldname +  upload.any() để lấy tên file hình
                        if(file.fieldname == 'img')
                        {
                            let path_img ='avatar'+ '-' + Date.now() + '-' + file.originalname;
                            cb(null, path_img);
                            link_avatar = path_img;
                            path.push("avatar");
                        }
                        else
                        {
                            let path_img ='item'+ '-' + Date.now() + '-' + file.originalname;
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

var link = {home:'',category:'',user:''};
//---------------------phân trang---------------------------------
router.get('/list_categories(/:pageNumber)?', async (req,res)=>{
    main = 'categories/list_category_product';
    link.category = 'active';
    // 1.limit 
    let limit = 2;
    // 2. tong so document 
    let totalDocument = await CategoryModel.find({status: false})
    // => tong so trang
    let totalPage = Math.ceil(totalDocument.length/limit);

    // 3. start 
    let pageNumber = req.params.pageNumber;
    if(typeof(pageNumber)=="string") pageNumber = parseInt(pageNumber);
    else if(pageNumber==undefined) pageNumber=1;
    if(pageNumber==undefined || pageNumber==1)
    {
        start =0 ;
        //xetActive=1;
    }
    else if(pageNumber>=2)
    {
        start = (pageNumber-1)*limit;
        //0 ,2 ,4 ,6
        //xetActive=page;
    }
    //xuat ra view
    // first
    view_totalPage=`<li class="page-item">
    <a class="page-link" href="list_categories/1">First</a></li>`;
    // Prev
    if(pageNumber==1)
    {
        view_totalPage += `<li class="page-item">
        <a class="page-link" href="list_categories/`+1+`">Prev</a></li>`;
    }
    else
    {
        view_totalPage += `<li class="page-item">
        <a class="page-link" href="list_categories/`+(pageNumber-1)+`">Prev</a></li>`;
    }

    for(let i = 1; i <= totalPage; i++)
    {
        let tmp='';
        (parseInt(pageNumber)==i) ? tmp = 'active': tmp ='';
        view_totalPage += `<li class="page-item `+tmp+`">
        <a class="page-link" href="list_categories/`+i+`">
        ` + i + `</a></li>`;
    }
    // Next
    if(totalPage>pageNumber)
    {
        view_totalPage += `<li class="page-item">
        <a class="page-link" href="list_categories/`+(pageNumber+1)+`">Next</a></li>`;
    }
    else
    {
        view_totalPage += `<li class="page-item">
        <a class="page-link" href="list_categories/`+totalPage+`">Next</a></li>`;
    }

    // Last
    view_totalPage += `<li class="page-item">
    <a class="page-link" href="list_categories/`+totalPage+`">Last</a></li>`;

    CategoryModel.find({status: false})
    .skip(start)// giữ  trang
    .limit(limit)
    .sort({_id: -1})
    .exec((err,data)=>{
        if(err)
        {
            res.send({kq: 0, err: err})
        }
        else
        {
            str ='';
                data.forEach((v)=>{
                    str +=  `<tr id="`+v._id+`">
                                <td>`+v.name+`</td>
                                <td>`+v.TYPE+`</td>
                                <td>`+v.Group+`</td>
                                <td><img src="/public/uploads/uploads/`+v.img+`" alt="`+v.img+`"></td>
                                <td>`+v.price+`</td>
                                <td>`+v.quantity+`</td>
                                <td>`+v.description+`</td>
                                <td>
                                    <button class="btn btn-info btn-adjust edit_product"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fa fa-pencil" style="padding:0px 5px"></i></button>
                                    <button type="button" class="btn btn-danger btn-adjust delete_product_tmp"><span style="display:none;">`+JSON.stringify(v)+`</span><i class="fa fa-trash" style="padding:0px 5px"></i></button>
                                </td>
                            </tr>`
                });
            
            res.render('index', {main: main, str:str, view_totalPage: view_totalPage, link: link});
        }
    });
});

//---------------------phân trang---------------------------------

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
                            description: req.body.content[1],
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
                            link_avatar=''; link_items=[];
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

router.post('/edit_file',(req,res)=>{
    upload.any()(req, res, function(err){
        let data_img = req.body.name_img.split(',');
        let list_imgs = req.body.e_list_img.split(',');
        // get list_imgs
        let get_list_imgs = list_imgs.filter(item => ![''].includes(item));
        if(err instanceof multer.MulterError)
        {
            (err.field == "img") ? res.send("File Avatar quá lớn"): res.send("File Items quá lớn");
        }
        else if(err) 
        {
            res.send(err);
        }
        else
        {
            (link_avatar!="") ? avatar = link_avatar : avatar = req.body.e_avatar_img;
            (link_items.length > 0) ? items = get_list_imgs.concat(link_items) : items = get_list_imgs;
                    obj =  { 
                                TYPE: req.body.TYPE,
                                Group: req.body.Group,
                                name: req.body.name,
                                price: req.body.price,
                                quantity: req.body.quantity,
                                img: avatar,
                                imgs: items,
                                description: req.body.content[1],
                                id_category: localStorage.getItem('id_user')
                            };
                    CategoryModel.updateMany({ _id: req.body.id },obj,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            delete_img(data_img,'avatar');
                            delete_img(data_img,'item');
                            avatar=''; items=['']; get_list_imgs=['']; link_avatar=''; link_items= [];
                            res.send('Completed!')
                        }
                    });
        }
    });
});

router.get('/add_categories',(req,res)=>{
    main = 'categories/add_category_product';
    link.category = 'active';
    res.render('index',{main:main, link: link});//gui du lieu khi su dung ejs
});


router.get('/list_delete_categories',(req,res)=>{
    main = 'categories/list_category_product';
    link.category = 'active';
    CategoryModel.find({status: true })
    .exec((err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            str ='';
            data.forEach((v)=>{
                str += `<tbody id="list_delete`+v._id+`">
                            <tr>
                            <td>`+v.name+`</td>
                            <td>`+v.TYPE+`</td>
                            <td>`+v.Group+`</td>
                            <td>`+v.img+`</td>
                            <td>`+v.price+`</td>
                            <td>`+v.quantity+`</td>
                            <td>`+v.description+`</td>
                            <td>
                                <button class="btn btn-info btn-adjust restore_product"><span style="display:none;">`+JSON.stringify(v._id)+`</span>Restore</button>
                                <button type="button" class="btn btn-outline-danger btn-adjust list_delete_product"><span style="display:none;">`+JSON.stringify(v)+`</span>Delete</button>
                            </td>
                            </tr>
                        </tbody>`
            });
            res.render('index',{main:main,str:str, link: link});//gui du lieu khi su dung ejs
        }
    });
});

router.post('/update_status_product',(req,res)=>{
    id = req.body.id;
    obj =  { status: true };
    CategoryModel.updateMany({ _id: id },obj,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send('da xoa')
            }
    });
});

router.post('/restore_product',(req,res)=>{
    id = req.body.id;
    obj =  { status: false };
    CategoryModel.updateMany({ _id: id },obj,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.send('Done!')
            }
    });
});

router.post('/delete_product',(req,res)=>{
    let data_delete = JSON.parse(req.body.database_product);
    CategoryModel.findByIdAndDelete({ _id: data_delete._id},(err,data)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            delete_img(data_delete.img,'avatar');
            delete_img(data_delete.imgs,'item');
            data_delete =[];
            res.send('da xoa')
        }
    });
})

module.exports = router; //xuat ra du lieu de su dung

function delete_img(data,key_data){
    if(typeof(data)=='string')
    {
        if (fs.existsSync('./public/uploads/uploads/'+ data))
        {
            fs.unlink('./public/uploads/uploads/'+ data, function (err) {
                if (err) throw err;
                console.log('File deleted!');
            });
        }
    }
    else
    {
        for(i in data)
        {
            if(data[i].includes(key_data))
            {
                if (fs.existsSync('./public/uploads/uploads/'+ data[i]))
                {
                    fs.unlink('./public/uploads/uploads/'+ data[i], function (err) {
                        if (err) throw err;
                        console.log('File deleted!');
                    });
                }
            }
        } 
    } 
}

// router.post('/SHOW_IMG',(req,res)=>{
//     let c =[];
//     fs.readdirSync("./public/uploads/uploads").forEach(file => {
//         c.push("/public/uploads/uploads/"+file);
//     });
//     res.send(c);
// })