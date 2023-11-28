import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Anime } from 'src/app/core/interfaces/anime';
import { LibraryService } from 'src/app/core/services/library.service';
import { ReviewService } from 'src/app/core/services/review.service';
import { AnimeFormComponent } from 'src/app/shared/components/anime-form/anime-form.component';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.page.html',
  styleUrls: ['./anime.page.scss'],
})
export class AnimePage implements OnInit {

  public reviewCreated:boolean | undefined

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    public anime:LibraryService,  
    private modal: ModalController,
    public reviewService:ReviewService,
  ) { 
    this.route.params.subscribe(params => { // Con esto obtenemos el id del anime en base a la URL
      let idNumber = +params['id']; // Parseamos a un number
      this.anime.getAnimeById(idNumber).subscribe(animeData => {
            this.anime.setAnime(animeData);
            this.reviewService.getReviews().subscribe()
    });
  });
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
  


  async presentAnime(data:Anime|null, onDismiss:(result:any)=>void){ // Ejecuta el modal
    
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

  public editAnime(){ // Editar anime
    var onDismiss = (info:any)=>{
      switch(info.role){
        case 'submit':{
          if (this.anime.anime) {
              this.anime.editAnime(this.anime.anime, info.data).subscribe();
        }
          }
        break;
        default:{
          console.error("No debería entrar");
        }
      }
    }
    this.presentAnime(this.anime.anime, onDismiss);
    }


}
