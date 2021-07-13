import {Recipe} from "../recipe.model";
import * as RecipesActions from "./recipes.actions";

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export function recipesReducer(state: State = initialState, action: RecipesActions.RecipesActions): State {
  switch(action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      }
    case RecipesActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      const recipe = state.recipes[action.index]
      const updatedRecipe = {
        ...recipe,
        ...action.payload
      }
      const updateRecipes = [...state.recipes]
      updateRecipes[action.index] = updatedRecipe
      return {
        ...state,
        recipes: updateRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.index
        }),
      }
    default:
      return state
  }
}
