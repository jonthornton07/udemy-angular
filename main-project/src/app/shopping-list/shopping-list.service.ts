import {EventEmitter} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";

export class ShoppingListService {

  ingredientsChanged = new EventEmitter<Ingredient[]>()

  private ingredients: Ingredient[] = [{
    name: "Melons",
    amount: "5"
  },{
    name: "Plums",
    amount: "10"
  }]

  getIngredients() {
    return this.ingredients.slice()
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredientsChanged.emit(this.getIngredients())
  }

  addIngredients(incoming: Ingredient[]) {
    this.ingredients.push(...incoming)
    this.ingredientsChanged.emit(this.getIngredients())
  }
}
