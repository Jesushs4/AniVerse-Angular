import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  constructor(
    private router:Router,
    private auth:AuthService,
    private menu:MenuController
  ) { }

  ngOnInit() {}


  goSearch() {
    this.menu.close();
    this.router.navigate(['/search'])
  }
  

  goLibrary() {
    this.menu.close();
    this.router.navigate(['/library'])
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login'])
  }

}
