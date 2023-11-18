import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Anime } from 'src/app/core/interfaces/anime';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {

  anime: Anime;

  constructor(
    private router:Router,
  ) { 
    var libraryInfo = this.router.getCurrentNavigation();
    this.anime = libraryInfo?.extras.state as Anime;
  }

  ngOnInit() {
    console.log(this.anime);
  }

}
