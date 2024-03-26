var express = require('express');
var router = express.Router();

/* GET home page. */
const homePageRouter = router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', homePageRouter);

module.exports = {
  router,
  homePageRouter,
  };
