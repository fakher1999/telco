import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

  private url = 'http://127.0.0.1:3000/author/'

  getAll()  {

    return this.http.get(this.url + 'all' );

  }

  banned(id: Number){

    return this.http.get(this.url + 'banned/' + id );

  }

  suspend(id: Number){

    return this.http.get(this.url + 'suspend/' + id );

  }
  activate(id: Number,date: Number){

    return this.http.get(this.url + 'activate/' + id + '/' + date);

  }
}
