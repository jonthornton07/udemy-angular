import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map, switchMap} from "rxjs/operators";
import * as RecipesActions from "../store/recipes.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions"

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input() recipe: Recipe
  id: number

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id']
        }),
        switchMap(id => {
          this.id = id
          return this.store.select('recipes')
        }),
        map(state => {
          return state.recipes.find((recipe, index) => {
            return index === this.id
          })
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe
      })
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
  }

  onEditRecipe() {
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route})
  }

  deleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
