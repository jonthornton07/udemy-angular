import { Component, OnInit } from '@angular/core';
import { Recipe } from "../recipe.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [{
    name: 'A Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg'
  },{
    name: 'A Test Recipe',
    description: "This is simply a test",
    imagePath: 'https://www.glutenfreeandmore.com/wp-content/uploads/2018/07/10brisket.jpg'
  }]

  constructor() { }

  ngOnInit(): void {
  }

  addRecipe(recipe: Recipe) {

  }

}
