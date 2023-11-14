import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Anime } from 'src/app/core/interfaces/anime';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
})
export class AnimeCardComponent  implements OnInit {
@Input() anime: Anime | null = null;

  constructor(
    private auth:AuthService
  ) { }

  ngOnInit() {}

  addToLibrary() {
    this.auth.me().subscribe({
      next: (user: User) => {
        // Aquí puedes acceder al objeto 'user' que devuelve 'me()'
        console.log(user);
        
        // Continúa con el resto de la lógica de 'addToLibrary()'
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

}
