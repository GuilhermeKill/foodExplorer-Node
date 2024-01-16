const { Router } = require('express');

// Importando as Rotas
const usersRoutes = require('./users.routes');
const dishesRoutes = require('./dishes.routes')
const dishesAdminRoutes = require('./dishesAdmin.routes')
const sessionsRoutes = require('./sessions.routes')

const routes = Router();



routes.use('/users', usersRoutes);
routes.use('/dishes', dishesRoutes);
routes.use('/adminDishes', dishesAdminRoutes);
routes.use('/sessions', sessionsRoutes);


module.exports = routes;