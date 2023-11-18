import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Anime, Library } from '../interfaces/anime';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  
  private _library:BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  public library$:Observable<Anime[]> = this._library.asObservable();

  constructor(
    private auth: AuthService,
    private apiService : ApiService,
  ) {

  }

  async getLibrary() {
    let user = this.auth.me();
    user.subscribe(async user => {
      let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&populate=anime`));
      let animes = response.data.map((anime:Library) => {
        console.log(anime);
        return {
          
          id: anime.id,
          title: anime.attributes.anime.data[0].attributes.title,
          title_english: anime.attributes.anime.data[0].attributes.title_english,
          episodes: anime.attributes.anime.data[0].attributes.episodes,
          status: anime.attributes.anime.data[0].attributes.status,
          synopsis: anime.attributes.anime.data[0].attributes.synopsis,
          year: anime.attributes.anime.data[0].attributes.year,
          images: {
            jpg: {
              image_url: anime.attributes.anime.data[0].attributes.image_url,
            }
          },
          genres: anime.attributes.anime.data[0].attributes.genres, 
          favorites: anime.attributes.anime.data[0].attributes.favorites,
          mal_id: anime.attributes.anime.data[0].attributes.mal_id,
          episodes_watched: anime.attributes.episodes_watched, 
          watch_status: anime.attributes.watch_status,
          score: anime.attributes.score
        }
      })
      console.log(animes);
      this._library.next(animes);
    },
    error => {
      console.error("Error");
    }
    )
  }

}
