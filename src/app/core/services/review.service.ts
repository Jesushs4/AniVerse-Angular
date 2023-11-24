import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { CreateReview, Review } from '../interfaces/review';
import { AuthService } from './auth.service';
import { LibraryService } from './library.service';
import { ApiService } from './strapi/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  _ownReview:BehaviorSubject<Review | null> = new BehaviorSubject<Review | null>(null);
  ownReview$:Observable<Review | null> = this._ownReview.asObservable();

  _reviews:BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>([]);
  reviews$:Observable<Review[]> = this._reviews.asObservable();

  constructor(
    private auth:AuthService,
    private libraryService: LibraryService,
    private apiService: ApiService
  ) { }

  createReview(form:any):Observable<CreateReview> {
    return new Observable<CreateReview>(obs => {
          this.libraryService.getAnimeFromLibrary(this.libraryService.anime!).subscribe({
      next: async (libraryId:number) => { 
        let currentDate = new Date();
        let formattedDate = currentDate.toISOString().split('T')[0];
        let review:CreateReview = {
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

  getReviews():Observable<Review[]> {
    return new Observable<Review[]>(obs => {
      this.libraryService.getAnimeFromLibrary(this.libraryService.anime!).subscribe({
        next: async (libraryId:number) => {
          let libraryResponse = await lastValueFrom(this.apiService.get(`/reviews?filters[library][id][$eq]=${libraryId}&populate=library`));
          let library = libraryResponse.data[0].attributes.library
          let userResponse = await lastValueFrom(this.apiService.get(`/library?filters[id][$eq]=${library.data[0].id}&populate=user`));
          let user = userResponse.data[0].attributes.user
          let extendedResponse = await lastValueFrom(this.apiService.get(`/extended-users?filters[user_id][id][$eq]=${user.data[0].id}`))
          
        }
      })
    })
  }


}
