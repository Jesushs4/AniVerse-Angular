import { Component, Input, OnInit } from '@angular/core';
import { Review } from 'src/app/core/interfaces/review';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent  implements OnInit {

@Input() review:Review | undefined

  constructor(
    private auth: AuthService
  ) { 
  }

  ngOnInit() {}



  }

