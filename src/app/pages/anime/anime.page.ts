import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Anime } from 'src/app/core/interfaces/anime';
import { LibraryService } from 'src/app/core/services/library.service';
import { AnimeFormComponent } from 'src/app/shared/components/anime-form/anime-form.component';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {
  constructor(
    private router:Router,
    public anime:LibraryService,  
    private modal: ModalController
  ) { 

  }

  ngOnInit() {
  }

  public backToLibrary() {
    this.router.navigate(['/library']);
  }

  public deleteAnime() {
      if (this.anime.anime) {
        this.anime.deleteAnime(this.anime.anime).subscribe();
        this.router.navigate(['/library']);
      }
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

  editAnime(){

    var onDismiss = (info:any)=>{
      switch(info.role){
        case 'edit':{
          console.log(info.data)
          if (this.anime.anime) {
              this.anime.editAnime(this.anime.anime, info.data)
        }
          }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentForm(this.anime.anime, onDismiss);
    }


}
