import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JikanApiService {

  constructor(
    private http: HttpClient
  ) { }

  searchAnime(search: string): Observable<any> {
    const url = `${environment.apiURL}/anime?q=${encodeURIComponent(search)}`;
    return this.http.get(url);
  }
}
