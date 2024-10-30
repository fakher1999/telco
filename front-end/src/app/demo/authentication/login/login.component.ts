// angular import
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  // public method
  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];

  author = {
    email: '',
    password: '',
  }

  token :any;

  loginError:boolean = false;
  constructor(private _auth: AuthService , private router : Router) {  }
  
  login(){

    this._auth.login(this.author).subscribe(
      (res: any)=>{
        console.log(res.status)
        if (res.status == 400) {
          this.loginError = true;
        }else{
          this.token = res ;
          console.log(res);
          
          localStorage.setItem('token' , this.token.token)
          localStorage.setItem('permissions' , this.token.permissions)
          localStorage.setItem('isadmin' , this.token.isAdmin)
          localStorage.setItem('role' , this.token.role)
          this.router.navigate(['/task']);
        }
      }
      ,
      (err) =>{
        this.loginError = true;
        console.log(err);

      }
    )
  }

  goToRegister( ){
    this.router.navigate(['/register']);
  }
}
