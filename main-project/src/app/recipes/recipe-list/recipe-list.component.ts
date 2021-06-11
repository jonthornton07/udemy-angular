import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Recipe } from "../recipe.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeWasSelected = new EventEmitter<Recipe>()

  recipes: Recipe[] = [{
    name: 'A Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg'
  },{
    name: 'B Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg'
  }]

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(element: Recipe) {
    this.recipeWasSelected.emit(element)
  }
}
