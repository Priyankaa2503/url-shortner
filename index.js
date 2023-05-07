const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const ShortUrl  = require("./models/urlModel")
const bcrypt = require('bcrypt')

const app =express();
app.set("view engine",'ejs')
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const users = []
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
  })
  app.get('/login', (req, res) => {
    res.render('login.ejs')
  })
  // app.post('/login' {
  //   successRedirect: '/',
  //   failureRedirect: '/login',
  //   failureFlash: true
  // }))
  app.get('/register', (req, res) => {
    res.render('register.ejs')
  })
  app.post('/register',  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
  
    res.redirect('/')
  })
  
  app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
const PORT =process.env.PORT || 3002;
app.listen(PORT, console.log(`server started on port ${PORT}`));


