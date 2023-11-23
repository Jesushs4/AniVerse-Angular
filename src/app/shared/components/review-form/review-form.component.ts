import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent  implements OnInit {
  form:FormGroup;
  /*
  mode:'New'|'Edit' = 'New';
  @Input() set anime(_anime:Anime|null) {
    if (_anime) {
      this.mode = 'Edit'
      console.log(_anime);
      this.form.controls['user_score'].setValue(_anime.user_score);
      this.form.controls['watch_status'].setValue(_anime.watch_status);
      this.form.controls['episodes_watched'].setValue(_anime.episodes_watched);
    }
  }*/

  constructor(
    private formBuilder:FormBuilder
  ) {
    this.form = this.formBuilder.group({
      summary:['', ],
      review:['', ],
      date_added:[''],
      user_score:[''],
      nickname:[''],
    })
   }
  ngOnInit() {
  }

  onSubmit() {
    this.form.value
  }


}
