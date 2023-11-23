import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, tap } from 'rxjs';
import { Anime, Library } from '../interfaces/anime';
import { ApiService } from './strapi/api.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  
  private _library:BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  public library$:Observable<Anime[]> = this._library.asObservable();

  private _anime:BehaviorSubject<Anime | null> = new BehaviorSubject<Anime | null>(null);
  public anime$:Observable<Anime | null> = this._anime.asObservable();

  public anime:Anime|null = null;

  constructor(
    private auth: AuthService,
    private apiService : ApiService,
  ) {

  }

  setAnime(anime:Anime):Observable<Anime> {
    if(anime!=null) {
      this.anime = anime;
    }
    return new Observable(observer => {
      this._anime.next(anime);
      observer.next(anime);
      observer.complete();
    })
  }

   getLibrary():Observable<Anime[]> {
    return new Observable<Anime[]>(obs => {
      this.auth.me().subscribe({
        next:async (user:User) => {
          let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&populate=anime`));
        let animes:Anime[] = response.data.map((anime:Library) => {
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
            user_score: anime.attributes.user_score
          }
        })
        this._library.next(animes);
          obs.next(animes)
        }
      })
    })
  }

  deleteAnime(anime:Anime):Observable<Anime> {
    return new Observable<Anime>(obs => {
      this.auth.me().subscribe({
        next: async (user:User) => {
        let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&filters[anime][mal_id][$eq]=${anime.mal_id}`));
        await lastValueFrom(this.apiService.delete(`/libraries/${response.data[0].id}`));
        this._anime.next(anime);
        obs.next(anime);
        this.getLibrary().subscribe();
        }
      })
    })
  }

  editAnime(anime:Anime, form:any):Observable<Anime> {
    return new Observable<Anime>(obs => {
      this.auth.me().subscribe({
        next: async (user:User) => {
        let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&filters[anime][mal_id][$eq]=${anime.mal_id}`));
        let info = {
          data: {
            episodes_watched: form.episodes_watched,
            watch_status: form.watch_status,
            user_score: form.user_score
          }
        }
        let newAnime = await lastValueFrom(this.apiService.put(`/libraries/${response.data[0].id}`, info));
        anime.episodes_watched = newAnime.data.attributes.episodes_watched;
        anime.watch_status = newAnime.data.attributes.watch_status;
        anime.user_score = newAnime.data.attributes.user_score;
        this._anime.next(anime);
        obs.next(anime);
        this.setAnime(anime).subscribe();
        this.getLibrary().subscribe();
        }
      })
    })
  }

}
