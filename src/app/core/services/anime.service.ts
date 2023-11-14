import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  _searchResults:BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  searchResults$:Observable<Anime[]> = this._searchResults.asObservable();
  
  constructor() { }

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
