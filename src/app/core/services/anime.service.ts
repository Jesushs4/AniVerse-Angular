import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { Observable, finalize, from, lastValueFrom, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ApiService } from './strapi/api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(
    private apiService: ApiService,
    private auth: AuthService,
  ) { }

  private createAnime(anime: Anime): Observable<any> { // Crea anime
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
    return this.apiService.get(`/animes?filters[mal_id][$eq]=${animeToCreate.data.mal_id}`).pipe(
      switchMap(async existingAnime => {
        if (!(existingAnime.data.length > 0)) {
          let newAnime = await lastValueFrom(this.apiService.post("/animes", animeToCreate));
          this.createGenre(anime).subscribe(() => {

          });
        } else {
        }
      })

    )

  }

  private createGenre(anime: Anime): Observable<any> { // Crea genero
    let genres: number[] = [];
    return from(anime.genres).pipe(
      mergeMap(genre => {
        return this.apiService.get(`/genres?filters[name][$eq]=${genre.name}`).pipe(
          mergeMap(existingGenre => {
            let newGenre = {
              data: {
                name: genre.name
              }
            }
            if (existingGenre.data.length === 0) {
              return this.apiService.post(`/genres`, newGenre).pipe(tap(response => genres.push(response.data.id)));
            } else {
              genres.push(existingGenre.data[0].id);
              return of(null);
            }
          })
        )
      }),
      finalize(() => {
        this.tryingGenre(anime, genres).subscribe();
      })
      )
  }

  private tryingGenre(anime:Anime, genres: number[]):Observable<any> {
    console.log(genres)
    return new Observable(obs => {
      this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`).subscribe(async anime => {
        let post = {
          data: {
            anime: anime.data[0].id,
            genre: genres.map(id => ({ id: id }))
          }
        };
        await lastValueFrom(this.apiService.post(`/animegenres`, post))
        })
    })

  }


  public addAnimeUser(anime: Anime, form: any): Observable<any> { // Ejecuta las demas funciones y crea la relacion entre anime y user (biblioteca)
    return this.createAnime(anime).pipe(
      switchMap(() => this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`)), // Nos aseguramos de que primero se crea el anime y concatenamos con switchMap
      switchMap(animeResponse => {
        let animeId = animeResponse.data[0].id;
        return this.auth.me().pipe(
          switchMap(user => { // Obtenemos el user para crear la relacion entre anime y user
            let relation = {
              data: {
                user: user.id,
                anime: animeId,
                episodes_watched: form.episodes_watched,
                watch_status: form.watch_status,
                user_score: form.user_score
              }
            };
            return this.apiService.get(`/libraries?filters[anime][mal_id][$eq]=${anime.mal_id}&filters[user][id][$eq]=${user.id}`).pipe( // Comprobamos si ya hay una relación asi para que el usuario no pueda añadir un anime que ya ha añadido
              switchMap(existingAnimeUserRelation => {
                if (existingAnimeUserRelation.data.length === 0) {
                  return this.apiService.post("/libraries", relation); // Crea la relación si no existe
                } else {
                  return of(relation); // Si la relacion existe va a devolver la existente en un observable
                }
              })
            );
          })
        );
      })
    );
  }


}
