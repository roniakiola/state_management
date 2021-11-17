'use strict';
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session
  ({
    secret: 'ihan sama',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/form', (req, res) => {
  res.render('form');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/form'}), (req, res) => {
  console.log('success');
  res.redirect('/secret');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.get('/setCookie/:clr', (req, res) => {
  res.cookie('color', req.params.clr).send('eväste asetettu');
});

app.get('/getCookie', (req, res) => {
  console.log(req.cookies);
  res.send('color evästeessä lukee ' + req.cookies.color);
});

app.get('/deleteCookie', (req, res) => {
  res.clearCookie('color');
  res.send('Eväste poistettu');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
