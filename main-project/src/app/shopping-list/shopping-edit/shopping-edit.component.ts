import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {

  @Output() onIngredientAdded = new EventEmitter<Ingredient>()

  @ViewChild('nameInput', {static: false})
  nameInputRef: ElementRef

  @ViewChild('amountInput', {static: false})
  amountInputRef: ElementRef

  constructor() { }

  onAddItem() {
    this.onIngredientAdded.emit({
      name: this.nameInputRef.nativeElement.value,
      amount: this.amountInputRef.nativeElement.value
    })
  }
}
