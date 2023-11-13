import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  constructor(
    private router:Router,
    private auth:AuthService
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'])
    console.log(this.auth.isLogged$);
  }

}
