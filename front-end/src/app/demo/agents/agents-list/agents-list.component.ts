import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';
import { UserService } from 'src/app/services/user.service';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-agents-list',
  standalone: true,
  imports: [
    CardComponent,
    SharedModule,
    HttpClientModule,
    CommonModule,
    FormsModule, 
    MatTabsModule,
    RouterModule,
  ],
  providers: [UserService, AgentService] , // Provide the service here
  templateUrl: './agents-list.component.html',
  styleUrl: './agents-list.component.scss'
})
export class AgentsListComponent {

  agents = []
  permissionsList: any[] = [
    { id: '66693007e9b2b5672be9fcbf', name: 'TASKS' },
    { id: '66693050e9b2b5672be9fcc1', name: 'USERS' },
    { id: '66693082e9b2b5672be9fcc3', name: 'FINANCE' },
    { id: '671025d272d5a499ec1ddb65', name: 'RAPPORT' },
  ];

  constructor(private agentService: AgentService) {}

  mapPermissionsToNames() {
    this.agents.forEach(agent => {
      agent.permissions = agent.permissions.map(permissionId => {
        const permission = this.permissionsList.find(p => p.id === permissionId);
        return permission ? permission.name : permissionId; // If no match, return the original ID
      });
    });
  }

  ngOnInit(): void {
    this.agentService.getAllAgents().subscribe((res) => {
      console.log(res)
      this.agents = res;
      this.mapPermissionsToNames();
    })
  }

  delete(agentId) {
    this.agentService.deleteAgent(agentId).subscribe((res)=> {
      this.ngOnInit();
    })
  }
}
