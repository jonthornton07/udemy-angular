import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[]
  private recipeSub: Subscription

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.recipeSub = this.store.select('recipes').subscribe(state => {
      this.recipes = state.recipes
    })
  }

  ngOnDestroy() {
    this.recipeSub.unsubscribe()
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
