import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AnimeCardComponent } from './components/anime-card/anime-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';



@NgModule({
  declarations: [
    SearchBarComponent,
    AnimeCardComponent,
    NavbarComponent,
    LoginFormComponent,
    RegisterFormComponent,
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
  ]
})
export class SharedModule { }
