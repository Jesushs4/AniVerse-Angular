import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { Observable, lastValueFrom, map, of, switchMap } from 'rxjs';
import { ApiService } from './strapi/api.service';
import { AuthService } from './auth.service';
import { LibraryService } from './library.service';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(
    private apiService: ApiService,
    private auth: AuthService,
  ) { }

  private createAnime(anime: Anime): Observable<any> {
    console.log(anime.genres)
    return new Observable<any>(obs => {
      let animeToCreate = {
        data: {
          title: anime.title,
          title_english: anime.title_english,
          episodes: anime.episodes,
          status: anime.status,
          synopsis: anime.synopsis,
          year: anime.year,
          image_url: anime.images.jpg.image_url,
          mal_id: anime.mal_id
        }
      };
      console.log(anime.genres)
      this.apiService.get(`/animes?filters[mal_id][$eq]=${animeToCreate.data.mal_id}`).subscribe(
        async existingAnime => {
          if (!(existingAnime.data.length > 0)) {
            let newAnime = await lastValueFrom(this.apiService.post("/animes", animeToCreate));
            this.createGenre(anime).subscribe(() => {
                obs.next(newAnime);
                obs.complete();
            });
          } else {
            obs.next(anime);
            obs.complete();
          }
        }
      )
    })
  }

  private createGenre(anime: Anime): Observable<any> {
    return new Observable<any>(obs => {
      console.log(anime.genres);
      let genres = anime.genres;
      for (let genre of genres) {
        let genreToCreate = {
          data: {
            name: genre.name,
          },
        };
        this.apiService.get(`/genres?filters[name][$eq]=${genreToCreate.data.name}`).subscribe(
          async existingGenre => {
            if (!(existingGenre.data.length > 0)) {
              await lastValueFrom(this.apiService.post("/genres", genreToCreate));
              obs.next(genreToCreate);
              obs.complete();
            }
          }
        )

      }

    })
  }

  private animeGenreRelation(anime: Anime): Observable<any> {
    return new Observable<any>(obs => {
      this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`).subscribe(
        async animeRelation => {
          let genres = anime.genres;
          for (let genre of genres) {
            let genreRelation = await lastValueFrom(this.apiService.get(`/genres?filters[name]=${genre.name}`));
            let relation = {
              data: {
                anime: animeRelation.data[0].id,
                genre: genreRelation.data[0].id
              }
            }
            let existingRelationResponse = await lastValueFrom(this.apiService.get(`/animegenres?filters[anime][mal_id][$eq]=${relation.data.anime}&filters[genre][id][$eq]=${relation.data.genre}`));
            if (!(existingRelationResponse.data.length > 0)) {
              await lastValueFrom(this.apiService.post("/animegenres", relation));
              obs.next(relation)
              obs.complete();
            }
          }
        })
    }
    )


  }

  public addAnimeUser(anime: Anime, form: any): Observable<any> {
    return this.createAnime(anime).pipe(
      switchMap(() => this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`)),
      switchMap(animeResponse => {
        this.animeGenreRelation(anime).subscribe();
        console.log(animeResponse)
        // Asumiendo que animeResponse.data contiene la información del anime
        let animeId = animeResponse.data[0].id;
        return this.auth.me().pipe(
          switchMap(user => {
            let relation = {
              data: {
                user: user.id,
                anime: animeId,
                episodes_watched: form.episodes_watched,
                watch_status: form.watch_status,
                user_score: form.user_score
              }
            };
            console.log(relation)
            return this.apiService.get(`/libraries?filters[anime][mal_id][$eq]=${anime.mal_id}&filters[user][id][$eq]=${user.id}`).pipe(
              switchMap(existingAnimeUserRelation => {
                if (existingAnimeUserRelation.data.length === 0) {
                  // Sólo crear la relación si no existe
                  return this.apiService.post("/libraries", relation);
                } else {
                  // Si ya existe, emitir el objeto de relación existente
                  return of(relation);
                }
              })
            );
          })
        );
      })
    );
  }


}
