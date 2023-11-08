export interface Anime {
    id: number,
    title: string,
    images: {
        jpg: {
            image_url:string
        }
    }
    genres:any[]

    favorites: number,

}
