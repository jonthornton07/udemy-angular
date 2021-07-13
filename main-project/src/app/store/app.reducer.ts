import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import {ActionReducer} from "@ngrx/store";

export interface AppState {
  shoppingList: fromShoppingList.State
  auth: fromAuth.State
}

export const appReducer: ActionReducer<AppState> = {
  // @ts-ignore
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer
}
