const { Router } = require('express');

const multer = require('multer');
const uploadConfig = require('../configs/upload')

const DishesAdminController = require('../controllers/DishesAdminController');
const DishImageController = require('../controllers/DishImageController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const dishesAdminRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const dishesAdminController = new DishesAdminController();
const dishImageController = new DishImageController()

dishesAdminRoutes.use(ensureAuthenticated)


dishesAdminRoutes.post('/', upload.single("image"), dishesAdminController.create);
dishesAdminRoutes.delete('/:id', dishesAdminController.delete)
dishesAdminRoutes.put('/:id', dishesAdminController.update)

dishesAdminRoutes.patch('/dishImage/:id', upload.single("image"), dishImageController.update)

module.exports = dishesAdminRoutes;