const sessionName = (req, res, next) => {
  res.locals.username = req.session?.name; // если в сессии есть name то его записываем в res.locals.username чтобы все hbs его видели
  next();
};


