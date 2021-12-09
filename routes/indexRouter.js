const express = require('express');
const router = express.Router();

const { Users } = require('../db/models');
const { hello } = require('../middleware/allMiddleware');

const sha256 = require('sha256');



router.get('/', async (req, res) => {
  if(req.session.user) {
    const allUsers = await Users.findAll()
    return res.render('homePage', { allUsers })
  }
  else {
    return res.render('homePage')
  }
})
//create user
router.get('/registration', (req, res) => {
  res.render('registration')
})


router.get('/profile', async (req, res) => {

  // const allUsers = await Users.findAll()
  const {firstName, id, email} = req.session.user
  const currentUser = await Users.findOne({where: {id}})
  // console.log('====>>>>req.session', req.session.user);
  res.render('profile', { currentUser} )
})
router.post('/registration', async (req, res) => {
  const { firstName, lastName, email, password, bDay, dDay, addres, age, skills, wishes } = req.body;
  try {
    const user = await Users.create({ firstName, lastName, email, password: sha256(password), bDay, dDay, addres, age, skills, wishes, createdAt: new Date(), updatedAt: new Date() }); // создаем юзера в бд
    // console.log(user);
    // console.log(req.session);
     // ЗАПИСЫВАЕМ В СЕССИЮ ИМЯ ТОЛЬКО ЧТО ЗАРЕГИСТРИРОВАННОГО ЮЗЕРА
    req.session.user = { id: user.id, email: user.email, firstName: user.firstName };
    // redirect user page
    // res.sendStatus(200)
    res.redirect(`/profile`); // редирект на страницу лк
  } catch (err) {
    console.log(err)
  }
})



// login
router.get('/login', (req, res) => {
  res.render('login')
})

router.use(hello)

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userLogin = await Users.findOne({ where: { email } })
  if (userLogin) {
    if (userLogin.password === sha256(password)) {
      req.session.user = { id: userLogin.id, email: userLogin.email, firstName: userLogin.firstName };
      // console.log('--------', userLogin);
      // res.render('profile', userLogin)
      // return res.redirect(`/users/${userLogin.id}`)
      return res.redirect('/profile')
    }
    return res.send(`Your password is wrong, correct one is ${userLogin.password}`)
  }
  res.send('Wrong login!')
})

// router.get('/profile/:id', async (req, res) => {
//   const {id} = req.params;
//   const allData = await Users.findAll()
//   console.log(req.params);
//   res.render('profile', allData)
//   })
// logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('authname');
  res.redirect('/login');
});


module.exports = router
