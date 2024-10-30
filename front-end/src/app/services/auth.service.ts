import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://127.0.0.1:3000/author/';

  constructor(private http: HttpClient) { }

  register( author: any ){
    
    return this.http.post(this.url + 'register' , author );

  }

  login( author: any ){

    return this.http.post(this.url + 'login' , author );
    
  }


  isLoggedIn(){
    let token = localStorage.getItem('token');
    if(token){
      return true ;
    }else{
      return false ;
    }

  }

  getAuthorDataFromToken(){
    let token = localStorage.getItem('token');
    
    if(token){
      let data = JSON.parse(atob(token.split('.')[1]));
      return data ;
    } 
    
  }


  getById(id: any){
    return this.http.get(this.url + 'getById/' + id);
  }

  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Extract user ID from token
      return this.http.get<any>(`${this.url}getById/${userId}`);
    }
    throw new Error('No token found');
  }
}
