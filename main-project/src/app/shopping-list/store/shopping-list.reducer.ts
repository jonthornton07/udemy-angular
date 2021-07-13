import {Ingredient} from "../../shared/ingredient.model";
import * as Actions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[],
  editingIngredient: Ingredient,
  editingIngredientIndex: number
}

const initialState: State = {
  ingredients: [{
    name: "Melons",
    amount: "5"
  },{
    name: "Plums",
    amount: "10"
  }] as Ingredient[],
  editingIngredient: null,
  editingIngredientIndex: -1
}

export function shoppingListReducer(state: State = initialState, action: Actions.ShoppingListActions) {
  switch(action.type) {
    case Actions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action.payload
        ]
      }
    case Actions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          ...action.payload
        ]
      }
    case Actions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editingIngredientIndex]
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      }
      const updatedIngredients = [...state.ingredients]
      updatedIngredients[state.editingIngredientIndex] = updatedIngredient
      return {
        ...state,
        ingredients: updatedIngredients,
        editingIngredientIndex: initialState.editingIngredientIndex,
        editingIngredient: initialState.editingIngredient
      }
    case Actions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editingIngredientIndex
        }),
        editingIngredientIndex: initialState.editingIngredientIndex,
        editingIngredient: initialState.editingIngredient
      }
    case Actions.START_EDIT_INGREDIENT:
      return {
        ...state,
        editingIngredient: { ...state.ingredients[action.index] },
        editingIngredientIndex: action.index
      }
    case Actions.STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editingIngredient: initialState.editingIngredient,
        editingIngredientIndex: initialState.editingIngredientIndex
      }
    default:
      return state
  }
}
