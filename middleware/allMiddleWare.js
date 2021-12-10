

const hello = (req, res, next) => {
  res.locals.username = req.session?.name;
  console.log("RES LOCALS: ================================>",res.locals);
  next();
};

const userChecker = (req, res, next) => { // этот мидлвер пропускает пользователя, если он авторизован (т.е если есть ключ name в сессии) или редиректит на главную, если он не авторизован (см стр 11 в index.js роутере )
  if (req.session.name) {
    return next();
  }
  res.redirect('/');
}

module.exports = { hello, userChecker }
