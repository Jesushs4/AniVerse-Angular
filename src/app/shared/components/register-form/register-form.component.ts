import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent  implements OnInit {


  form:FormGroup;

  constructor(
    private _modal:ModalController,
    private formBuilder:FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      id:[null],
      username:['', [Validators.required]],
      nickname:['', [Validators.required]],
      email:['', [Validators.required]],
      password:['', [Validators.required]],
      confirm:['', [Validators.required]]
    })
  }

  ngOnInit() {}

  onCancel(){
    this._modal.dismiss(null, 'cancel');
  }

  onSubmit(){
    this._modal.dismiss(this.form.value, 'ok');
  } 

  hasError(control:string, error:string):boolean{
    let errors = this.form.controls[control].errors;
    return errors!=null && error in errors;
  
  }
}
