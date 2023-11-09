import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  constructor(
    public router:Router
  ) { }

  ngOnInit() {}

  navActive = false;

  toggleNav() {
    this.navActive = !this.navActive;
  }

  goSearch() {
    this.router.navigate(['/search'])
  }
  

  goLibrary() {
    this.router.navigate(['/library'])
  }

}
