import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { Observable, lastValueFrom, map, switchMap } from 'rxjs';
import { ApiService } from './strapi/api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(
    private apiService: ApiService,
    private auth: AuthService
  ) { }

  private async createAnime(anime:Anime) {
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
    let existingAnime = await lastValueFrom(this.apiService.get(`/animes?filters[mal_id][$eq]=${animeToCreate.data.mal_id}`))
    if (!(existingAnime.data.length>0)) {
      await lastValueFrom(this.apiService.post("/animes", animeToCreate));
    }
    await this.createGenre(anime);
    await this.animeGenreRelation(anime);
  }

  private async createGenre(anime:Anime) {
      let genres = anime.genres;
      for (let genre of genres) {
        let genreToCreate = {
          data: {
            name: genre.name,
          },
        };
        let existingGenre = await lastValueFrom(this.apiService.get(`/genres?filters[name][$eq]=${genreToCreate.data.name}`))
        if (!(existingGenre.data.length > 0)) {
          await lastValueFrom(this.apiService.post("/genres", genreToCreate));
        }
      }
  }

  private async animeGenreRelation(anime:Anime) {
    let animeRelation = await lastValueFrom(this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`));
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
      }
    }
  }

  public async addAnimeUser(anime:Anime, form:any) {
    await this.createAnime(anime);
    let animeId = await lastValueFrom(this.apiService.get(`/animes?filters[mal_id]=${anime.mal_id}`));
    let user = this.auth.me();
    user.subscribe(async user => {
      let relation = {
              data: {
        user: user.id,
        anime: animeId.data[0].id,
        episodes_watched: form.episodes_watched,
        watch_status: form.watch_status,
        user_score: form.user_score
        
        }
      }
      let existingAnimeUserRelation = await lastValueFrom(this.apiService.get(`/libraries?filters[anime][mal_id][$eq]=${anime.mal_id}&filters[user][id][$eq]=${user.id}`))
      console.log(existingAnimeUserRelation.data.length);
      if (!(existingAnimeUserRelation.data.length>0)) {
        await lastValueFrom(this.apiService.post("/libraries", relation));
      } 
      
    }
      )
  }


}
