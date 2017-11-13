var express = require('express');
var router = express.Router();
var BDD = [
      {"id": "1", "name": "Create the Todo List", "status":"En Cours"}
];

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Todo List' });
});

router.get('/add', function(req, res, next) {
	res.render('add', { title: 'Ajout d\'une nouvelle todo'});
});

module.exports = router;
