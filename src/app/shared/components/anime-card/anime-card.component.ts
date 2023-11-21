import { Component, Input, OnInit, Output } from '@angular/core';
import { Anime } from 'src/app/core/interfaces/anime';
import { AnimeService } from 'src/app/core/services/anime.service';
import { AnimeFormComponent } from '../anime-form/anime-form.component';
import { ModalController, ToastController, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
})
export class AnimeCardComponent  implements OnInit {
@Input() anime: Anime | null = null;

  constructor(
    private animeService:AnimeService,
    private modal: ModalController,
    private router:Router
  ) { }

  ngOnInit() {
    }
    
  

  isSearchPage():boolean {
    return this.router.url.includes('search');
  }



    

  async presentForm(data:Anime|null, onDismiss:(result:any)=>void){
    
    const modal = await this.modal.create({
      component:AnimeFormComponent,
      componentProps:{
        anime:data
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        onDismiss(result);
      }
    });
  }

  addToLibrary(){
    var onDismiss = (info:any)=>{
      switch(info.role){
        case 'submit':{
          console.log(info.data)
          if (this.anime) {
              this.animeService.addAnime(this.anime, info.data)
        }
          }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentForm(this.anime, onDismiss);
  }

}
