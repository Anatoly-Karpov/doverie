const express = require('express');
const path = require('path');
const logger = require('morgan');
const process = require('process');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sha256 = require('sha256');

const indexRouter = require('./routes/indexRouter');

const app = express(); // app - экземпляр сервера


// Start server settings
require('dotenv').config(); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // дает нам право рендерить hbs в res.render()
// End server settings

// Start middleware section
app.use(logger('dev'));
app.use(express.json()); // Распознавание входящего объекта в POST-запросе как объекта JSON

app.use(express.urlencoded({ extended: true })); // чтобы данные из форм корректно обрабатывались
app.use(express.static('public')); // указали public в кач-ве статической директории, т.е. это папка, к которой юзер имеет доступ
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET ?? '101010',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  name: 'authname',
}));
// End middleware section
app.use((req, res, next) => {
  res.locals.username = req.session.name
  next()
})
// Start routes section
app.use('/', indexRouter); // используем indexRouter для обработки всех запросов, которые начинаются с /

// End routes section

app.listen(process.env.PORT ?? 3000)
