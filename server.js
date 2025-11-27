import express from "express";
const app = express();

const port = 3000;

import userM from './models/user.m.js'; 
//set up Handlebars view engine
import {create} from 'express-handlebars';
// Configure Handlebars
const hbs = create({
    extname: '.hbs',
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main',
    helpers: {
        // Helper to check if two values are equal
        ifEquals: function (a, b, options) {
            return a === b ? options.fn(this) : options.inverse(this);
        },
        // Helper to repeat a block n times for counting pages
        pages: function (n, options) {
            let accum = '';
            for (let i = 1; i <= n; ++i) {
                options.data.index = i;
                options.data.first = i === 1;
                options.data.last = i === n;
                accum += options.fn(i);
            }
            return accum;
        },
        // Helper to add two numbers
        sum: (a, b) => a + b
    },
});
//configure Handlebars
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

//dùng lệnh req body
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//create __dirname variable
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/imgs', express.static(__dirname + '/assets/imgs'));

// Import session
import session from 'express-session';
app.use(session({
    secret: 'SECRET_KEY_CUA_BAN',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt secure: true nếu dùng HTTPS
}));

// 2. THÊM ĐOẠN MIDDLEWARE NÀY (Đặt ngay sau app.use(session...))
app.use(async (req, res, next) => {
    if (req.session.userId) {
        // Nếu có userId trong session (đã đăng nhập)
        try {
            const user = await userM.oneById(req.session.userId);
            if (user) {
                // Tạo biến initials (VD: Nguyễn Văn A -> NVA) để hiện lên Avatar
                const initials = user.name
                    .split(' ')
                    .map(n => n.charAt(0).toUpperCase())
                    .join('');

                // Gán user vào res.locals để mọi View (hbs) đều dùng được
                res.locals.user = {
                    ...user,
                    initials: initials
                };
            }
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }
    next(); // Cho phép chạy tiếp sang các Router bên dưới
});


// ...existing code...
app.use('/categories', categoryRouter);

// testdb
import db from './models/db.js'
app.get('/testdb', async function (req, res) {
        const list = await db('categories');
        res.json(list);
});

// view list categories
app.get('/admin/categories',async function(req,res){
    const list = await db('categories');
    res.render('vwCategory/index', {
        categories : list
    });
});

//view add category
app.get('/admin/categories/add',async function(req,res){
    res.render('vwCategory/add', {
    });
});

//add new entity:title
app.post('/admin/categories/add', async function (req, res) {
    const entity = {
        title: req.body.title
    }
    await db('categories').insert(entity);
    res.render('vwCategory/add');    
})

app.get('/admin/categories/edit/:id', async function(req, res){
    const id = req.params.id || 0;
    const entity = await db('categories').where('id',id).first();
    res.render('vwCategory/edit', {
        category : entity
    });
})

//remove categories
app.post('/admin/categories/del',async function (req, res) {
    const id = req.body.id;
    await db('categories').where('id', id).del();
    res.redirect('/admin/categories');
})

//patch categories
app.post('/admin/categories/patch',async function (req, res) {
    const id = req.body.id;
    const entity = {
        title : req.body.title
    };
    await db('categories').where('id',id).update(entity);
    res.redirect('/admin/categories')
})
app.use('/', homeRouter);  
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

import homeRouter from './routers/home.r.js';
import categoryRouter from './routers/category.r.js';
import productRouter from './routers/product.r.js';
import authRouter from './routers/auth.r.js';
app.use('/auth', authRouter);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));