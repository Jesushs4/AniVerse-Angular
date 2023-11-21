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

  searchResult(event:any) {
    this.search.searchResult(event);
  }

  




}

