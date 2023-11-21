import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibraryService } from 'src/app/core/services/library.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {

  constructor(
    private router:Router,
    public anime:LibraryService
  ) { 

  }

  ngOnInit() {
  }

  public backToLibrary() {
    this.router.navigate(['/library']);
  }

  public deleteAnime() {
    this.anime.anime$.subscribe(anime => {
      if (anime) {
        this.anime.deleteAnime(anime);
        this.router.navigate(['/library']);
      }
    })
  }

}
