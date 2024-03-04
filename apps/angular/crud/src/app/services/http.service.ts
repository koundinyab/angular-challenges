import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  public put<T, U>(url: string, data: U, headers: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.put<T>(url, data, options);
  }

  public delete<T>(url: string, headers: HttpHeaders): Observable<T> {
    const options = { headers };
    return this.http.delete<T>(url, options);
  }
}
