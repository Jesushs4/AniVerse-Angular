import { Component } from '@angular/core';
import { JikanApiService } from 'src/app/core/services/jikan-api.service';
import { SearchService } from 'src/app/core/services/search.service';
import { ApiService } from 'src/app/core/services/strapi/api.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})

export class SearchPage {


  constructor(
    public search:SearchService,
    private apiService: JikanApiService
  ) {
    apiService.searchAnime("").subscribe(search => { // Al inicializar la página, que busque vació "" para que salga algo
      this.search.searchResult(search.data)
    })
  }

  searchResult(event:any) { // Obtiene la información enviada por el evento y actualiza el BehaviourSubject con ella
    this.search.searchResult(event);
  }

  




}

