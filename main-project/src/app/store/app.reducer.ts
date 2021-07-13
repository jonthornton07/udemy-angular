import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import {ActionReducer} from "@ngrx/store";
import * as fromRecipes from "../recipes/store/recipes.reducer"

export interface AppState {
  shoppingList: fromShoppingList.State
  auth: fromAuth.State
  recipes: fromRecipes.State
}

export const appReducer: ActionReducer<AppState> = {
  // @ts-ignore
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
  recipes: fromRecipes.recipesReducer
}
