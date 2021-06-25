import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>()
  startedEditing = new Subject<number>()

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

  getIngredient(index: number) {
    return this.ingredients[index]
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredientsChanged.next(this.getIngredients())
  }

  addIngredients(incoming: Ingredient[]) {
    this.ingredients.push(...incoming)
    this.ingredientsChanged.next(this.getIngredients())
  }

  updateIngredient(index: number, updated: Ingredient) {
    this.ingredients[index] = updated
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
