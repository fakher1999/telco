import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RapportService } from './rapport.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rapports',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SharedModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [RapportService] , // Provide the service here

  templateUrl: './rapports.component.html',
  styleUrl: './rapports.component.scss'
})
export class RapportsComponent {
  rapports: any[] = [];

  constructor(private rapportService: RapportService, private router: Router) {}

  ngOnInit() {
    this.rapportService.getRapports().subscribe(
      data => {
        console.log("data", data) ;
        this.rapports = data
      }, 
        
      error => console.error('Error fetching rapports', error)
    );
  }
}
