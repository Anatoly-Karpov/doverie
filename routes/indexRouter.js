const express = require('express');
const router = express.Router();

const { User } = require('../db/models');
const { hello, userChecker } = require('../middleware/allMiddleware');

const sha256 = require('sha256');


router.get('/', async (req, res) => {
  if (req.session.name) {
    const allUsers = await User.findAll()
    const user = req.session.name;
    return res.render('homePage', { allUsers, user })
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
  const currentUserName = req.session.name
  const currentUser = await User.findOne({ where: { firstName: currentUserName } })
  res.render('profile', { currentUser })
})

router.post('/registration', async (req, res) => {
  const { firstName, lastName, email, password, bDay, dDay, addres, age, skills, wishes } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, password: sha256(password), bDay, dDay, addres, age, skills, wishes, createdAt: new Date(), updatedAt: new Date() }); // создаем юзера в бд
    // ЗАПИСЫВАЕМ В СЕССИЮ ИМЯ ТОЛЬКО ЧТО ЗАРЕГИСТРИРОВАННОГО ЮЗЕРА
    req.session.name = firstName;
    res.redirect(`/${user.id}`); // редирект на страницу лк
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
  const userLogin = await User.findOne({ where: { email } })
  if (userLogin) {
    if (userLogin.password === sha256(password)) {
      req.session.name = userLogin.firstName
      req.session.id = userLogin.id
      console.log('=========>>>>id', req.session.id)
      return res.redirect(`/${userLogin.id}`)

    }
    return res.send(`Your password is wrong, correct one is ${userLogin.password}`)
  }
  res.send('Wrong login!')
})


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('authname');
  res.redirect('/login');
});

// edit user
router.put('/:id', async (req, res) => {
  const { firstName, email, bDay } = req.body;
  try {
    await User.update({ firstName, email, bDay }, { where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400)
  }
})


// all users with buttons
router.get('/', async (req, res) => {
  const allUsers = await User.findAll({ raw: true });
  const users = allUsers.map((user) => ({ ...user, birthday: `${user.bDay.getDay()}.${user.birthday.getMonth()}.${user.birthday.getFullYear()}` })); // с помощью магии мапим день рождения юзера, явно указываем что в каждом юзере будет копия юзера с измененным полем birthday
  res.render('allUsers', { allUsers: users });

});

// delete user
router.delete('/:id', userChecker, async (req, res) => { // ручка срабатывает на запрос типа delete и удаляет юзера
  const { id } = req.params;
  console.log('===>>>>id', id)
  try {
    await User.destroy({ where: { id } });
    req.session.destroy();
    res.clearCookie('authname');
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(553);
  }
});

// get user
router.get('/:id', userChecker, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render('profile', { user });
});


module.exports = router
