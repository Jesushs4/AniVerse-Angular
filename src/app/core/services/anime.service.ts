import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientWebProvider } from './http-client-web.provider';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  _searchResults:BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  searchResults$:Observable<Anime[]> = this._searchResults.asObservable();
  
  constructor(
    private apiService:ApiService,
    private auth:AuthService
  ) { }
  
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
      !anime.genres?.some(genre => genre.name === 'Hentai')
    );  }
  
  filterIrrelevant(animes:Anime[]):Anime[] {
    return animes.filter(anime => anime.favorites>10);
  }

  async createAnime(anime:Anime) {
    try {
          let animeToCreate = {
      data: {
        title: anime.title,
        title_english: anime.title_english,
        episodes: anime.episodes,
        status: anime.status,
        synopsis: anime.synopsis,
        year: anime.year,
        image_url: anime.images.jpg.image_url,
        idApi: anime.mal_id
      }
      
    };
    await lastValueFrom(this.apiService.post("/animes", animeToCreate));
    this.createGenre(anime);
    this.animeGenreRelation(anime);
    this.addLibrary(anime);
    } catch (error) {
      console.log(`El objeto ya se encuentra creado`);
    }

  }

  async createGenre(anime:Anime) {
    
      let genres = anime.genres;
      for (let genre of genres) {
        try {
        let genreToCreate = {
          data: {
            name: genre.name,
          },
        };
  
        await lastValueFrom(this.apiService.post("/genres", genreToCreate));
        
      } catch (error) {
        console.log(`El objeto ya se encuentra creado`);
      }
      }
  }

  async animeGenreRelation(anime:Anime) {
    let animeRelation = await lastValueFrom(this.apiService.get(`/animes?filters[idApi]=${anime.mal_id}`));
    let genres = anime.genres;
    for (let genre of genres) {
      let genreRelation = await lastValueFrom(this.apiService.get(`/genres?filters[name]=${genre.name}`));
      let relation = {
        data: {
          anime: animeRelation.data[0].id,
          genre: genreRelation.data[0].id
        }
      }
      await lastValueFrom(this.apiService.post("/animegenres", relation));
    }
  }

  async addLibrary(anime:Anime) {
    let animeId = await lastValueFrom(this.apiService.get(`/animes?filters[idApi]=${anime.mal_id}`));
    let user = this.auth.me();
    user.subscribe(user => {
      let relation = {
              data: {
        user: user.id,
        anime: animeId.data[0].id
      }
      }
      lastValueFrom(this.apiService.post("/libraries", relation));


    }
      )
  }

}
