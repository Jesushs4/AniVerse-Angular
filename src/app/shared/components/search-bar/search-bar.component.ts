import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { JikanApiService } from 'src/app/core/services/jikan-api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],

})
export class SearchBarComponent  implements OnInit {
  searchControl = new FormControl();

  constructor(private apiService: JikanApiService) { }
  @Output() searchUpdate = new EventEmitter<any[]>();
  
  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), 
        distinctUntilChanged(),
        switchMap(term => this.apiService.searchAnime(term))
      )
      .subscribe({
        next: (results) => {
          this.searchUpdate.emit(results.data);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

}
