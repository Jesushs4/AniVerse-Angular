import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegisterFormComponent } from 'src/app/shared/components/register-form/register-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auth:AuthService,
    private router:Router,
    private modal: ModalController,
    private toast: ToastController
  ) { }

  ngOnInit() {
  }

  onLogin(credentials:UserCredentials){
    this.auth.login(credentials).subscribe({
      next:data=>{
        this.router.navigate(['search'])
      },
      error:err=>{
        console.log(err);
      }
    });
  }

  async presentForm(data:UserRegisterInfo|null, onDismiss:(result:any)=>void){
    
    const modal = await this.modal.create({
      component:RegisterFormComponent,
      componentProps:{
        user:data
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }

  onRegister(){
    var onDismiss = (info:any)=>{
      console.log(info);
      switch(info.role){
        case 'ok':{
          this.auth.register(info.data).subscribe(async user=>{
              const options:ToastOptions = {
              message:"User created",
              duration:1000,
              position:'bottom',
              color:'tertiary',
              cssClass:'card-ion-toast'
            };
            const toast = await this.toast.create(options);
            toast.present();
          })
        }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentForm(null, onDismiss);
  }
  

}

