import { Component } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { Anime } from 'src/app/core/interfaces/anime';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  _searchResults:BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  searchResults$:Observable<Anime[]> = this._searchResults.asObservable();
  constructor(
    
  ) {}

  searchResult(event:Anime[]) {
    let filteredAnimes = this.filterContent(event);
    filteredAnimes = this.filterIrrelevant(filteredAnimes);
    filteredAnimes = this.filterByPopularity(filteredAnimes);
    this._searchResults.next(filteredAnimes);
  }

  filterByPopularity(animes:Anime[]):Anime[] {
    return [...animes].sort((a, b) =>  b.favorites - a.favorites);
  }

  filterContent(animes:Anime[]):Anime[] {
    return animes.filter(anime => 
      !anime.genres.some(genre => genre.name === 'Hentai')
    );  }
  
  filterIrrelevant(animes:Anime[]):Anime[] {
    return animes.filter(anime => anime.favorites>10);
  }


}
