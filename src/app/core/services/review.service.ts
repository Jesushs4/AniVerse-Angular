import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { CreateReview, Review } from '../interfaces/review';
import { AuthService } from './auth.service';
import { LibraryService } from './library.service';
import { ApiService } from './strapi/api.service';
import { Anime } from '../interfaces/anime';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  _ownReview: BehaviorSubject<Review | null> = new BehaviorSubject<Review | null>(null);
  ownReview$: Observable<Review | null> = this._ownReview.asObservable();

  _reviews: BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>([]);
  reviews$: Observable<Review[]> = this._reviews.asObservable();

  constructor(
    private auth: AuthService,
    private libraryService: LibraryService,
    private apiService: ApiService
  ) { }

  createReview(form: any): Observable<CreateReview> {
    return new Observable<CreateReview>(obs => {
      this.libraryService.getAnimeIdFromLibrary(this.libraryService.anime!).subscribe({
        next: async (libraryId: number) => {
          let currentDate = new Date();
          let formattedDate = currentDate.toISOString().split('T')[0];
          let review: CreateReview = {
            data: {
              summary: form.summary,
              review: form.review,
              library: libraryId,
              date_added: formattedDate
            }
          }
          let response = await lastValueFrom(this.apiService.post(`/reviews`, review));
          obs.next(review);
        }
      })
    })
  }

  getReviews(): Observable<Review[]> {
    //console.log(this.libraryService.anime)
    return new Observable<Review[]>(obs => {
      this.libraryService.getAnimeFromLibrary(this.libraryService.anime!).subscribe({
        next: async (libraryId: Anime) => {
          console.log(libraryId)
          let libraryResponse = await lastValueFrom(this.apiService.get(`/reviews?filters[library][anime][mal_id][$eq]=${libraryId.mal_id}&populate=library`));
          let reviews: Review[] = [];
          console.log(libraryResponse)
              for (let userReview of libraryResponse.data) {
                  let library = userReview.attributes.library.data;
                  let userResponse = await lastValueFrom(this.apiService.get(`/libraries?filters[id][$eq]=${library.id}&populate=user`));
                  let user = userResponse.data[0].attributes.user.data[0].id;
                  let extendedResponse = await lastValueFrom(this.apiService.get(`/extended-users?filters[user_id][id][$eq]=${user}`));
                  let nickname = extendedResponse.data[0].attributes.nickname;
                  this.auth.me().subscribe( ownUser => {
                                      reviews.push({
                      summary: userReview.attributes.summary,
                      review: userReview.attributes.review,
                      date_added: userReview.attributes.date_added,
                      user_score: library.attributes.user_score,
                      user_id: user,
                      nickname: nickname,
                      own_review: ownUser.id == user
                      })
                  })
                  }

          console.log(reviews)
          this._reviews.next(reviews);
          obs.next(reviews);
          obs.complete();

        }
      })
    })
  }


}
