import {Component} from '@angular/core';
import {DataStorage} from "../shared/data-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private dataStorage: DataStorage) { }

  saveData() {
    this.dataStorage.storeRecipes()
  }

  fetchData() {
    this.dataStorage.fetchData().subscribe()
  }
}
