import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Ingredient} from "../../shared/ingredient.model";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from '../../store/app.reducer'

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false}) slForm: NgForm
  editMode = false
  editedItem: Ingredient
  private sub: Subscription

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.sub = this.store.select('shoppingList').subscribe(state => {
      if (state.editingIngredientIndex > -1) {
        this.editMode = true
        this.editedItem = state.editingIngredient
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onSubmit(form: NgForm) {
    const value = form.value
    const ingredient = {
      name: value.name,
      amount: value.amount
    }
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient))
    } else{
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient))
    }
    this.clearForm()
  }

  clearForm() {
    this.store.dispatch(new ShoppingListActions.StopEditIngredient())
    this.slForm.reset()
    this.editMode = false
  }

  deleteItem() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient())
    this.clearForm()
  }
}
