import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Anime } from 'src/app/core/interfaces/anime';

@Component({
  selector: 'app-anime-form',
  templateUrl: './anime-form.component.html',
  styleUrls: ['./anime-form.component.scss'],
})
export class AnimeFormComponent  implements OnInit {

  form:FormGroup;
  @Input() anime: Anime | null = null;

  constructor(
    private newModal:ModalController,
    private formBuilder:FormBuilder
  ) {
    console.log(this.anime);
    this.form = this.formBuilder.group({
      score:['', ],
      status:['', ],
      episode: ['0',]
    })
   }
  ngOnInit() {
  }

  onCancel() {
    this.newModal.dismiss(null, 'cancel');
  }

  onSubmit() {
    this.newModal.dismiss(this.form.value, 'submit');
  }



}
