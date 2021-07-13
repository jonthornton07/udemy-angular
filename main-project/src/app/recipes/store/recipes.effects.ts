import {Actions, Effect, ofType} from "@ngrx/effects";
import * as RecipesActions from "./recipes.actions"
import {map, switchMap, tap, withLatestFrom} from "rxjs/operators";
import {Recipe} from "../recipe.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";

@Injectable()
export class RecipesEffects {

  @Effect()
  fetchRecipes = this.actions.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.httpClient.get<Recipe[]>('https://ng-recipe-project-c30b0-default-rtdb.firebaseio.com/recipes.json')
    }),
    map(recipes => {
      if (recipes) {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        })
      }
      else {
        return []
      }
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes)
    })
  )

  @Effect({dispatch: false})
  saveRecipes = this.actions.pipe(
    ofType(RecipesActions.SAVE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.httpClient
        .put('https://ng-recipe-project-c30b0-default-rtdb.firebaseio.com/recipes.json', recipeState.recipes)
    })
  )

  constructor(private actions: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {
  }

}
