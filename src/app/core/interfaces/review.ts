export interface Review {
    summary: string,
    review: string,
    date_added: Date,
    user_score: number,
    nickname: string
}

export interface CreateReview {
    data: {
    summary: string,
    review: string,
    library: number,
    date_added: string 
    }

}
