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

  backToLibrary() {
    this.router.navigate(['/library'])
  }

}
