const express = require('express');
const router = express.Router();

const { Users } = require('../db/models');
const { hello } = require('../middleware/allMiddleware');

const sha256 = require('sha256');



router.get('/', async (req, res) => {
  if (req.session.name) {
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
  const { firstName, id, email } = req.session.name
  const currentUser = await Users.findOne({ where: { id } })
  res.render('profile', { currentUser })
})
router.post('/registration', async (req, res) => {
  const { firstName, lastName, email, password, bDay, dDay, addres, age, skills, wishes } = req.body;
  try {
    const user = await Users.create({ firstName, lastName, email, password: sha256(password), bDay, dDay, addres, age, skills, wishes, createdAt: new Date(), updatedAt: new Date() }); // создаем юзера в бд

    // ЗАПИСЫВАЕМ В СЕССИЮ ИМЯ ТОЛЬКО ЧТО ЗАРЕГИСТРИРОВАННОГО ЮЗЕРА
    // req.session.user = { id: user.id, email: user.email, firstName: user.firstName };
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
  const userLogin = await Users.findOne({ where: { email } })
  if (userLogin) {
    if (userLogin.password === sha256(password)) {
      // req.session.user = { id: userLogin.id, email: userLogin.email, firstName: userLogin.firstName };
req.session.name = userLogin.firstName
      // return res.redirect('/profile')
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



// all users with buttons
router.get('/', async (req, res) => {
  const allUsers = await Users.findAll({ raw: true });
  const users = allUsers.map((user) => ({ ...user, birthday: `${user.bDay.getDay()}.${user.birthday.getMonth()}.${user.birthday.getFullYear()}` })); // с помощью магии мапим день рождения юзера, явно указываем что в каждом юзере будет копия юзера с измененным полем birthday
  // console.log(users);
  res.render('allUsers', { allUsers: users });
});

// router.get('/', async (req, res) => {
//   const { id } = req.params
//   console.log('>>>>>>>>>>>>>>>>', req.params);
//   const currentProfile = await Users.findOne({ where: { id } })

//   res.render('editProfile', { currentProfile })
// })

// edit user
router.put('/:id', async (req, res) => {
  const { fistName, email, bDay } = req.body;
  try {
    await Users.update({ fistName, email, bDay }, { where: { id: req.params.id } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400)
  }


  //   const { id } = req.params
  //   const currentProfile = await Users.findOne({ where: { id } })
  //   if (currentProfile) {
  //     if (currentProfile.id === id) {
  //   req.session.user = { id: currentProfile.id, email: currentProfile.email};
  //   return res.redirect('/profile/edit')
  // }
  // return res.send(`Your profile does not exist ${currentProfile.email}`)
  //   }
  // res.send('something wrong!')
})

// delete user
router.delete('/:id', async (req, res) => { // ручка срабатывает на запрос типа delete и удаляет юзера
  const { id } = req.params;
  try {
    await Users.destroy({ where: { id } });
    res.sendStatus(222);
  } catch (error) {
    console.log(error);
    res.sendStatus(553);
  }
});

// get user
router.get('/:id', async (req, res) => {
  const user = await Users.findByPk(req.params.id);
  res.render('profile', { user });
});


module.exports = router
