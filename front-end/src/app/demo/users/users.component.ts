import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,CardComponent,SharedModule,HttpClientModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers :[UserService]
})


export class UsersComponent {

  date = new Date().getTime();
  users: any = []
  activate_date: Date = new Date();
  SelectedUserId: Number = 0;
  constructor( private UserService: UserService , private router: Router){  }

  ngOnInit(): void {

    this.fetchUsers();

  }

  fetchUsers(): void {
    this.UserService.getAll()
      .subscribe(users => {
        this.users = users;
        this.date = new Date().getTime();

       
        
      });
  }

  setSelectedUserId(id : Number): void {
    this.SelectedUserId = id;
  }
  setActiveDate(text: any){
    this.activate_date = new Date(text.target.value);
  }

  banned(id : Number): void{
    this.UserService.banned(id)
      .subscribe(res => {
        this.fetchUsers();
        
      });
  }
  searchByCompanyName(event: any){
    let companyName = event.target.value;
    console.log(companyName);
    this.UserService.getAll()
      .subscribe(users => {
        this.users = users
        this.users = this.users.filter((user: { companyname: any; }) =>  user.companyname.includes(companyName) );
        this.date = new Date().getTime();

       
        
      });
  }

  suspend(id : Number): void{
    this.UserService.suspend(id)
      .subscribe(res => {

        this.fetchUsers();
        
      });
  }

  activate(): void{
    let date = this.activate_date.getTime();
    console.log(this.SelectedUserId);
    console.log(this.activate_date);
    console.log(date)
    this.UserService.activate(this.SelectedUserId,date)
      .subscribe(res => {

        this.fetchUsers();
        
      });
  }

  formatDate(timestamp:any) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp ); // Multiply by 1000 to convert from seconds to milliseconds

    // Get the day, month, and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-indexed, so add 1
    const year = date.getFullYear();

    // Pad single-digit day and month with leading zeros
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    // Construct the date string in the format "dd/mm/yyyy"
    const dateString = formattedDay + '/' + formattedMonth + '/' + year;
    if (dateString == "01/01/3000") {
      return "Suspended";
    }
    return dateString;
}


  
}
