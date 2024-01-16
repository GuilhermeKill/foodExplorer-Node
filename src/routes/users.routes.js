const { Router } = require('express');
const multer = require('multer');


const UsersController = require('../controllers/UsersController');

const usersController = new UsersController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const usersRoutes = Router();

usersRoutes.post('/', usersController.create)

module.exports = usersRoutes;