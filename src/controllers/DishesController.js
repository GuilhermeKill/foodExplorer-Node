const knex = require('../database/knex');
const sqliteConnection = require('../database/sqlite')

class DishesController {
    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();

        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.status(200).json({
            ...dish,
            ingredients
        });
    }

    async index(request, response) {
        const { title, ingredients } = request.query;

        let dishes
        const database = await sqliteConnection();

        if (ingredients) {
            const filteredIngredients = ingredients.split(',').map(ingredient => ingredient.trim())
       
        const placeholders = filteredIngredients.map(() => '?').join(',');

        dishes = await database.all(`
            SELECT dishes.*
            FROM dishes
            JOIN ingredients ON dishes.id = ingredients.dish_id
            WHERE ingredients.name IN (${placeholders})
        `, filteredIngredients);

        
        } if(!dishes || dishes.length === 0) {
            if (title) {
                dishes = await knex("dishes")
                        .whereLike("title", `%${title}%`)
            }
            else {
                dishes = await knex("dishes")
            }
        }

        const dishesIngredients = await knex("ingredients")
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredient
            }
        })

        return response.status(200).json(dishesWithIngredients);
    }
};

// Exportando
module.exports = DishesController;

