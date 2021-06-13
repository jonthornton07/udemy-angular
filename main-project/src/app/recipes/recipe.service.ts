import {EventEmitter, Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>()

  private recipes: Recipe[] = [{
    name: 'A Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg',
    ingredients: [{
      name: 'Apples',
      amount: '10'
    },{
      name: 'Oranges',
      amount: '15'
    }]
  },{
    name: 'B Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg',
    ingredients: [{
      name: 'Veggies',
      amount: '2'
    },{
      name: 'Fruits',
      amount: '1'
    }]
  }]

  constructor(private shoppingListService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice()
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients)
  }
}
