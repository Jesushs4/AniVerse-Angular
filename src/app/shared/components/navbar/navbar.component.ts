import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { NicknameFormComponent } from '../nickname-form/nickname-form.component';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/core/services/strapi/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  public username:string = "";

  constructor(
    private router: Router,
    private auth: AuthService,
    private menu: MenuController,
    private modal: ModalController,
    private toast: ToastController,
    private apiService: ApiService
  ) { }

  ngOnInit() { 
    this.setUsername();
  }

  private setUsername() {
    this.auth.me().subscribe(user => {
      this.username = user.nickname
    })
  }

  goSearch() {
    this.menu.close();
    this.router.navigate(['/search']);
  }


  goLibrary() {
    this.menu.close();
    this.router.navigate(['/library']);
  }

  goAbout() {
    this.menu.close();
    this.router.navigate(['/about']);
  }

  logout() {
    this.menu.close();
    this.auth.logout();
    this.router.navigate(['/login']);
  }


  private setNickname(name: any): Observable<string> {
    return new Observable(observer => {
      this.auth.me().subscribe(async user => {
        let response = await lastValueFrom(this.apiService.get(`/extended-users?filters[user_id][id][$eq]=${user.id}`))
        let extendeduser_id = response.data[0].id
        let nickname = {
          data: {
            nickname: name.nickname
          }
        }
        let changeNickname = await lastValueFrom(this.apiService.put(`/extended-users/${extendeduser_id}`, nickname))
        observer.next(name)
        observer.complete();
      })
    })

  }

  async presentNickname(data: string | null, onDismiss: (result: any) => void) {

    const modal = await this.modal.create({
      component: NicknameFormComponent,
      componentProps: {
        nickname: data
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        onDismiss(result);
      }
    });
  }

  changeNickname() {
    var onDismiss = (info: any) => {
      this.setNickname(info.data).subscribe(async nickname => {
        this.setUsername();
        const options: ToastOptions = {
          message: "Nickname changed",
          duration: 1000,
          position: 'bottom',
          color: 'tertiary',
        };
        const toast = await this.toast.create(options);
        toast.present();
      })

    }
    this.presentNickname(null, onDismiss);

  }


}



