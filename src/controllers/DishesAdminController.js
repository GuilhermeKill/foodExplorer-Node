const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require("../providers/DiskStorage")
const sqliteConnection = require('../database/sqlite')

class DishesAdminController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;


    const checkDishAlreadyExistInDatabase = await knex("dishes").where({ title }).first();

    if (checkDishAlreadyExistInDatabase) {
      throw new AppError("Este prato já existe em nossa database")
    }

  
    const dishFile = request.file.filename;
    const diskStorage = new DiskStorage()
    const filename = await diskStorage.saveFile(dishFile);

    const [dish_id] = await knex("dishes").insert({
      image: filename,
      title,
      description,
      category,
      price
    });

    const hasOnlyOneIngredient = typeof (ingredients) === "string"

    let ingredientsInsert

    if (hasOnlyOneIngredient) {
      ingredientsInsert = {
        dish_id: dish_id,
        name: ingredients
      }
    } else {
      ingredientsInsert = ingredients.map(ingredient => {
        return {
          name: ingredient,
          dish_id
        }
      });
    }




    await knex("ingredients").insert(ingredientsInsert)

    return response.status(201).json()

  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.status(204).json();
  }

  async update(request, response) {
    const { title, description, category, image, price, ingredents } = request.body;
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("O prato que você está tentando atualizar não existe")
    }

    dish.title = title
    dish.description = description
    dish.category = category
    dish.image = image ?? dish.image
    dish.price = price

    await knex("dishes").where({ id }).update(dish)
    await knex("dishes").where({ id }).update("updated_at", knex.fn.now())

    const hasOnlyOneIngredient = ingredents.length == 1;

    let ingredientsInsert

    if (hasOnlyOneIngredient) {
      console.log("asd")
      ingredientsInsert = {
        dish_id: dish.id,
        name: ingredents[0]
      }

    } else {
      ingredientsInsert = ingredents.map(ingredient => {
        return {
          dish_id: dish.id,
          name: ingredient
        }
      })

      await knex("ingredients").where({ dish_id: id }).delete()
      await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert)
    }

    await knex("ingredients").where({ dish_id: id }).delete()
    await knex("ingredients").where({ dish_id: id }).insert(ingredientsInsert)

    return response.status(202).json('Prato atualizado com sucesso')
  }
}

module.exports = DishesAdminController;