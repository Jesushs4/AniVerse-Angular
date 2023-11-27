import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, switchMap, tap } from 'rxjs';
import { Anime, Library } from '../interfaces/anime';
import { ApiService } from './strapi/api.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user';
import { AnimeService } from './anime.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private _library: BehaviorSubject<Anime[]> = new BehaviorSubject<Anime[]>([]);
  public library$: Observable<Anime[]> = this._library.asObservable();

  private _anime: BehaviorSubject<Anime | null> = new BehaviorSubject<Anime | null>(null);
  public anime$: Observable<Anime | null> = this._anime.asObservable();

  public anime: Anime | null = null;

  constructor(
    private auth: AuthService,
    private apiService: ApiService,
    private animeService: AnimeService
  ) {

  }

  setAnime(anime:Anime):Observable<Anime> {
      this.anime = anime;
    return new Observable(observer => {
      this._anime.next(anime);
      observer.next(anime);
      observer.complete();
    })
  }

  public addAnime(anime: Anime, form: any): Observable<Anime> {
    return new Observable<Anime>(observer => {
      this.animeService.addAnimeUser(anime, form).pipe(
        switchMap(() => this.getLibrary())
      ).subscribe();
      observer.next(anime);
    })
  }

  getAnimeById(mal_id: number): Observable<Anime> {
    return new Observable(observer => {
      this.auth.me().subscribe({
        next: async (user: User) => {

          let anime = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&filters[anime][mal_id][$eq]=${mal_id}&populate=anime`));
          let newAnime = {
            id: anime.data[0].id,
            title: anime.data[0].attributes.anime.data[0].attributes.title,
            title_english: anime.data[0].attributes.anime.data[0].attributes.title_english,
            episodes: anime.data[0].attributes.anime.data[0].attributes.episodes,
            status: anime.data[0].attributes.anime.data[0].attributes.status,
            synopsis: anime.data[0].attributes.anime.data[0].attributes.synopsis,
            year: anime.data[0].attributes.anime.data[0].attributes.year,
            images: {
              jpg: {
                image_url: anime.data[0].attributes.anime.data[0].attributes.image_url,
              }
            },
            genres: anime.data[0].attributes.anime.data[0].attributes.genres,
            favorites: anime.data[0].attributes.anime.data[0].attributes.favorites,
            mal_id: anime.data[0].attributes.anime.data[0].attributes.mal_id,
            episodes_watched: anime.data[0].attributes.episodes_watched,
            watch_status: anime.data[0].attributes.watch_status,
            user_score: anime.data[0].attributes.user_score
          }
          this._anime.next(newAnime);
          observer.next(newAnime);
          this.anime = newAnime;
          this.getLibrary().subscribe();
        }
      })
    })
  }

  getLibrary(): Observable<Anime[]> {
    return new Observable<Anime[]>(obs => {
      this.auth.me().subscribe({
        next: async (user: User) => {
          let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&populate=anime`));
          let animes: Anime[] = response.data.map((anime: Library) => {
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

  getAnimeIdFromLibrary(anime: Anime): Observable<number> {
    return new Observable<number>(obs => {
      this.auth.me().subscribe({
        next: async (user: User) => {
          let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&filters[anime][mal_id][$eq]=${anime.mal_id}`));
          obs.next(response.data[0].id)
        }
      })
    })
  }

  getAnimeFromLibrary(anime: Anime): Observable<Anime> {
    return new Observable<Anime>(obs => {
          obs.next(anime)
        })
      }

  deleteAnime(anime: Anime): Observable<Anime> {
    return new Observable<Anime>(obs => {
      this.auth.me().subscribe({
        next: async (user: User) => {
          let response = await lastValueFrom(this.apiService.get(`/libraries?filters[user][id][$eq]=${user.id}&filters[anime][mal_id][$eq]=${anime.mal_id}`));
          await lastValueFrom(this.apiService.delete(`/libraries/${response.data[0].id}`));
          this._anime.next(anime);
          obs.next(anime);
          this.getLibrary().subscribe();
        }
      })
    })
  }

  editAnime(anime: Anime, form: any): Observable<Anime> {
    return new Observable<Anime>(obs => {
      this.auth.me().subscribe({
        next: async (user: User) => {
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
          this.getLibrary().subscribe();
        }
      })
    })
  }

}
