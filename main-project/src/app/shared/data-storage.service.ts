import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class DataStorage {

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes()
    this.httpClient
      .put('https://ng-recipe-project-c30b0-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
      console.log(response)
    })
  }

  fetchData() {
    return this.httpClient
      .get<Recipe[]>('https://ng-recipe-project-c30b0-default-rtdb.firebaseio.com/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            }
          })
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      )
  }
}
