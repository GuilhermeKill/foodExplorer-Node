const { Router } = require('express');

const DishesController = require('../controllers/DishesController');

const dishesRoutes = Router();

const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const dishesController = new DishesController();


dishesRoutes.use(ensureAuthenticated)

dishesRoutes.get('/', dishesController.index);
dishesRoutes.get('/:id', dishesController.show);


module.exports = dishesRoutes;