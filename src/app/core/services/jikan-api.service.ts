import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClientWebProvider } from './http/http-client-web.provider';

@Injectable({
  providedIn: 'root'
})
export class JikanApiService {

  constructor(
    private http: HttpClientWebProvider
  ) { }

  searchAnime(search: string): Observable<any> {
    const url = `${environment.jikanURL}/anime?q=${search}`;
    return this.http.get(url);
  }
}
