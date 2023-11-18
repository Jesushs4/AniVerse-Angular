import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Anime } from 'src/app/core/interfaces/anime';
import { LibraryService } from 'src/app/core/services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {



  constructor(
    public libraryService: LibraryService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.libraryService.getLibrary();
  }

  onCardClicked(anime:Anime) {
    var animeToSend:NavigationExtras = {
      state: {
        anime: anime
      }
    };
    this.router.navigate(['/anime'], animeToSend);
  }


}
