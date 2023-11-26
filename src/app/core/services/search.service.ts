import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Anime } from '../interfaces/anime';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './strapi/api.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  _searchResults: BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  searchResults$: Observable<Anime[]> = this._searchResults.asObservable();

  constructor(
    private apiService: ApiService,
    private auth: AuthService
  ) { }

  searchResult(event: Anime[]) {
    let filteredAnimes = this.filterContent(event);
    filteredAnimes = this.filterIrrelevant(filteredAnimes);
    filteredAnimes = this.filterByPopularity(filteredAnimes);
    this._searchResults.next(filteredAnimes);
  }

  filterByPopularity(animes: Anime[]): Anime[] {
    return [...animes].sort((a, b) => b.favorites - a.favorites);
  }

  filterContent(animes: Anime[]): Anime[] {
    return animes.filter(anime =>
      !anime.genres?.some(genre => genre.name === 'Hentai')
    );
  }

  filterIrrelevant(animes: Anime[]): Anime[] {
    return animes.filter(anime => anime.favorites > 10);
  }
}
