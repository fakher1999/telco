import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RapportService } from '../rapport.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rapport-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardComponent,
    SharedModule,
    HttpClientModule
  ],
  providers: [RapportService] , // Provide the service here
  templateUrl: './rapport-detail.component.html',
  styleUrl: './rapport-detail.component.scss'
})
export class RapportDetailComponent {
  rapport: any;
  newDiscussion: string = '';
  isUser: boolean = true; // Set this based on your authentication logic
  role: any;
  constructor(
    private route: ActivatedRoute,
    private rapportService: RapportService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.role = localStorage.getItem('role')
          
    if (id) {
      this.rapportService.getRapports().subscribe(
        rapports => {
          this.rapport = rapports.find(r => r._id === id);
        },
        error => console.error('Error fetching rapport', error)
      );
    }
  }

  updateStatus(status: string) {
    if (this.rapport) {
      this.rapportService.updateStatus(this.rapport._id, status).subscribe(
        updatedRapport => {
          this.rapport = updatedRapport;
        },
        error => console.error('Error updating status', error)
      );
    }
  }

  addDiscussion() {
    if (this.rapport && this.newDiscussion.trim()) {
      this.rapportService.addDiscussion(this.rapport._id, this.newDiscussion).subscribe(
        updatedRapport => {
          this.rapport = updatedRapport;
          this.newDiscussion = '';
        },
        error => console.error('Error adding discussion', error)
      );
    }
  }
}
