export interface Anime {
    id: number,
    title: string,
    title_english: string,
    episodes: number,
    status: string,
    synopsis: string,
    year: number,
    images: {
        jpg: {
            image_url: string
        }
    }
    genres: any[],
    favorites: number,
    mal_id: number,
    episodes_watched: number,
    watch_status: string,
    score: number

}


export interface Library {
    id: number,
        attributes: {
            anime: {
                data: [{
                    attributes: {
                        title: string,
                        title_english: string,
                        episodes: number,
                        status: string,
                        synopsis: string,
                        year: number,
                        image_url: string,
                        genres: any[],
                        favorites: number,
                        mal_id: number,
                    }

                }]

            }
            episodes_watched: number,
            watch_status: string,
            score: number
        }
}

/*          id: anime.id,
          title: anime.data[0].attributes.anime.title,
          title_english: anime.data[0].attributes.anime.title_english,
          episodes: anime.data[0].attributes.anime.episodes,
          status: anime.data[0].attributes.anime.status,
          synopsis: anime.data[0].attributes.anime.synopsis,
          year: anime.data[0].attributes.anime.year,
          images: anime.data[0].attributes.anime.images,
          genres: anime.data[0].attributes.anime.genres, 
          favorites: anime.data[0].attributes.anime.favorites,
          mal_id: anime.data[0].attributes.anime.mal_id,
          episodes_watched: anime.data[0].attributes.episodes_watched, 
          watch_status: anime.data[0].attributes.watch_status,
          score: anime.data[0].attributes.score*/