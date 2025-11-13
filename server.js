import express from "express";
const app = express();

const port = 3000;


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
import homeRouter from './routers/home.r.js';
import categoryRouter from './routers/category.r.js';
import productRouter from './routers/product.r.js';


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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));