import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { lastValueFrom } from 'rxjs';
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

  async createAnime(anime:Anime, form:any) {
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
        mal_id: anime.mal_id
      }
    };
    await lastValueFrom(this.apiService.post("/animes", animeToCreate));
    this.createGenre(anime);
    this.animeGenreRelation(anime);
    this.addLibrary(anime, form);
    } catch (error) {
      console.log(`El objeto ya se encuentra creado`);
    }
  }

  async checkAnime(anime:Anime) {
    let user = this.auth.me();
    user.subscribe(async user => {

    })
    let check = await lastValueFrom(this.apiService.get(`https://aniverse-service.onrender.com/api/libraries?filters[user][id][$eq]=${anime.mal_id}&filters[anime][id][$eq]=${anime.mal_id}`))
  }

  private async createGenre(anime:Anime) {
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
        console.log(`El género ya se encuentra creado`);
      }
      }
  }

  private async animeGenreRelation(anime:Anime) {
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

  private async addLibrary(anime:Anime, form:any) {
    let animeId = await lastValueFrom(this.apiService.get(`/animes?filters[idApi]=${anime.mal_id}`));
    let user = this.auth.me();
    user.subscribe(async user => {
      let relation = {
              data: {
        user: user.id,
        anime: animeId.data[0].id,
        episodes_watched: form.episode,
        watch_status: form.status,
        score: form.score
        
      }
      }
      await lastValueFrom(this.apiService.post("/libraries", relation));
    }
      )
  }


}
