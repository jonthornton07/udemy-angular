import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import * as RecipesActions from "../store/recipes.actions"
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number
  isEditing = false
  recipeForm: FormGroup
  private storeSub: Subscription

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']
      this.isEditing = params['id'] != null
      this.initForm()
    })
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe()
    }
  }

  private initForm() {
    let recipeName = ''
    let imagePath = ''
    let description = ''
    let ingredients = new FormArray([])

    if (this.isEditing) {
      // const recipe = this.recipeService.getRecipe(this.id)
      this.storeSub = this.store.select('recipes').pipe(map(state => {
        return state.recipes.find((recipe, index) => {
          return index === this.id
        })
      })).subscribe(recipe => {
        recipeName = recipe.name
        imagePath = recipe.imagePath
        description = recipe.description
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            ingredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            }))
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': ingredients
    })
  }

  onSubmit() {
    if (this.isEditing) {
      this.store.dispatch(new RecipesActions.UpdateRecipe(this.id, this.recipeForm.value))
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }
    this.cancel()
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl('', Validators.required),
      'amount': new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    }))
  }

  removeIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index)
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
