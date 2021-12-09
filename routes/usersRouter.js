
const express = require('express');

const { Users } = require('../db/models');
const router = express.Router();
const sha256 = require('sha256');



router.get('/', async (req, res) => {
  const allUsers = await Users.findAll()
  res.render("homePage", { allUsers })
})
//create user
router.get('/registration', (req, res) => {
  res.render('registration')
})

router.post('/registration', async (req, res) => {
  const { login, email, password } = req.body;
  const user = await Users.create({ login, email, password: sha256(password) }); // создаем юзера в бд
  // console.log(user);
  console.log(req.session);
  req.session.name = login; // ЗАПИСЫВАЕМ В СЕССИЮ ИМЯ ТОЛЬКО ЧТО ЗАРЕГИСТРИРОВАННОГО ЮЗЕРА
  // redirect user page
  // res.sendStatus(200)
  res.redirect(`/users/${user.id}`); // редирект на страницу лк
})

// login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const { login, passsword } = req.body;
  const user = await Users.findOne({where: {login}})
  if (user) {
  if (user.password === sha256(password)) {
    req.session.name = user.login;
    return res.redirect(`/users/${user.id}`)
  }
  return res.send(`Your password is wrong, correct one is ${user.password}`)
}
res.send('Wrong login!')
})


module.exports = router
