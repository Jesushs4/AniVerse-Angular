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
            image_url:string
        }
    }
    genres:any[],
    favorites: number,

}
