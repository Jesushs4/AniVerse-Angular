import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AnimeCardComponent } from './components/anime-card/anime-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from './components/navbar/navbar.component';



@NgModule({
  declarations: [
    SearchBarComponent,
    AnimeCardComponent,
    NavbarComponent,
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
  ]
})
export class SharedModule { }
