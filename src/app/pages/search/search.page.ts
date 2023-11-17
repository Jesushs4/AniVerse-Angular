import { Component } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Anime } from 'src/app/core/interfaces/anime';
import { AnimeService } from 'src/app/core/services/anime.service';
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

