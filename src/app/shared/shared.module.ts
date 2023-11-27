import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AnimeCardComponent } from './components/anime-card/anime-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AnimeFormComponent } from './components/anime-form/anime-form.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { UserReviewPipe } from './pipes/user-review.pipe';



@NgModule({
  declarations: [
    SearchBarComponent,
    AnimeCardComponent,
    NavbarComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AnimeFormComponent,
    ReviewFormComponent,
    ReviewsComponent,
    UserReviewPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule

  ],
  exports: [
    SearchBarComponent,
    AnimeCardComponent,
    NavbarComponent,
    LoginFormComponent,
    RegisterFormComponent,
    AnimeFormComponent,
    ReviewFormComponent,
    ReviewsComponent,
    UserReviewPipe,
  ]
})
export class SharedModule { }
