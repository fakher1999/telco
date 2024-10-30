// angular import
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { authGuard } from 'src/app/services/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule ,RouterModule,CommonModule,SharedModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers:[AuthService]

})
export default class RegisterComponent {
  // public method
  SignUpOptions = [
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

  step = 1;

  author = {
    companyName: '',
    companyAddress: '',
    vatNumber: '',
    website: '',
    primaryFocus: '',
    about: '',
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    applicantNumber :'',
    password:''
  }

  logo: any;
  RNE: any;
  PATENTE: any;

  selectLogo(e:any){
    this.logo = e.target.files[0];
  }

  selectRNE(e:any){
    this.RNE = e.target.files[0];
  }
  selectPATENTE(e:any){
    this.PATENTE = e.target.files[0];
  }

  constructor( private _auth: AuthService , private router: Router){  }

  next() {
    this.step = 2;
  }
  prevoice(){
    this.step = 1;
  }

  register(){
    let fd = new FormData()
    fd.append('companyName',this.author.companyName);
    fd.append('companyAddress',this.author.companyAddress);
    fd.append('vatNumber',this.author.vatNumber);
    fd.append('website',this.author.website);
    fd.append('primaryFocus',this.author.primaryFocus);
    fd.append('about',this.author.about);
    fd.append('firstName',this.author.firstName);
    fd.append('lastName',this.author.lastName);
    fd.append('email',this.author.email);
    fd.append('password',this.author.password);
    fd.append('title',this.author.title);
    fd.append('applicantNumber',this.author.applicantNumber);
    fd.append('logo',this.logo);
    fd.append('RNE',this.RNE);
    fd.append('patente',this.PATENTE);

    

    this._auth.register(fd)
      .subscribe(
        res=>{
          // this.router.navigate(['/login']);
          console.log("ok");
        }
      )
  }

}

