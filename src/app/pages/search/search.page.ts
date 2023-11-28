import { Component } from '@angular/core';
import { SearchService } from 'src/app/core/services/search.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage {


  constructor(
    public search:SearchService
  ) {}

  searchResult(event:any) { // Obtiene la información enviada por el evento y actualiza el BehaviourSubject con ella
    this.search.searchResult(event);
  }

  




}

