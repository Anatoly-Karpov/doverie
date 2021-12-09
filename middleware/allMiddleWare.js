

const hello = (req, res, next) => {
  res.locals.username = req.session?.name;
  console.log("RES LOCALS: ================================>",res.locals);
  next();
};

// const something = (req, req, next) {

// }

module.exports = { hello }
