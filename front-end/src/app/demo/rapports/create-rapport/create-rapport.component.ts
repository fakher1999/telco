import { Component } from '@angular/core';
import { RapportService } from '../rapport.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-create-rapport',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardComponent,
    SharedModule,
    HttpClientModule,
  ],
  providers: [RapportService,TaskService] , // Provide the service here
  templateUrl: './create-rapport.component.html',
  styleUrl: './create-rapport.component.scss'
})
export class CreateRapportComponent {
  taskId: string = '';
  content: string = '';
  tasks: any;

  constructor(
    private rapportService: RapportService,
    private TaskService: TaskService,
    private router: Router
  ) {}
  
  ngOnInit(){

      this.TaskService.getAll().subscribe(tasks => {
        console.log('Fetched tasks:', tasks);
        this.tasks = tasks;
    })
  
  }

  onSubmit() {
    if (this.taskId && this.content) {
      this.rapportService.createRapport(this.taskId, this.content).subscribe(
        (response) => {
          console.log('Rapport created successfully', response);
          // Navigate to the rapport list or detail page
          this.router.navigate(['/rapports']);
        },
        (error) => {
          console.error('Error creating rapport', error);
          // Handle error (e.g., show error message to user)
        }
      );
    }
  }
}
