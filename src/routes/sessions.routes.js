const { Router } = require('express');

const SessionsController = require('../controllers/SessionsController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const sessionsController = new SessionsController();


const sessionsRoutes = Router();


sessionsRoutes.post('/', sessionsController.create);

module.exports = sessionsRoutes;