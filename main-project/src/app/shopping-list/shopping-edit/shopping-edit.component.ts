import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Ingredient} from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false}) slForm: NgForm
  private sub: Subscription
  editMode = false
  editingItemIndex: number
  editedItem: Ingredient

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.sub = this.shoppingListService.startedEditing.subscribe(index => {
      this.editMode = true
      this.editingItemIndex = index
      this.editedItem = this.shoppingListService.getIngredient(index)
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
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
      this.shoppingListService.updateIngredient(this.editingItemIndex, ingredient)
    } else{
      this.shoppingListService.addIngredient(ingredient)
    }
    this.editMode = false
    this.slForm.reset()
  }
}
