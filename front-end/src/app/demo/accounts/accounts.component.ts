import { AfterViewInit, Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from 'src/app/services/agent.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-accounts',
  standalone: true,
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  imports: [CardComponent,SharedModule,HttpClientModule, CommonModule, FormsModule, MatTabsModule],
  providers: [UserService, AgentService]  // Provide the service here

})
export class AccountsComponent implements AfterViewInit {
  username: string = "";
  password: string = "";
  selectedPermissions: { [key: string]: boolean } = {};
  permissions: any = [
    { "id": "66693007e9b2b5672be9fcbf", "name": "TASKS" },
    { "id": "66693050e9b2b5672be9fcc1", "name": "USERS" },
    { "id": "66693082e9b2b5672be9fcc3", "name": "FINANCE" },
    { "id": "671025d272d5a499ec1ddb65", "name": "RAPPORT" },
  ];
  currentTabIndex: number = 0;

  private emailDomains: { [key: string]: string } = {
    '0': '@telcotec.agent',
    '1': '@telcotec.superuser',
    '2': '@telcotec.partner'
  };

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {}
  
  ngAfterViewInit() {
    let mt = 
    (document.getElementsByClassName('mat-tab-labels'))[0] as HTMLElement;
    mt.style.display='grid';
    mt.style.gridTemplateColumns='repeat(auto-fit, minmax(3em, 1fr))'
  }

  onTabChange(event: MatTabChangeEvent) {
    this.currentTabIndex = event.index;
  }

  get domain(): string {
    return this.emailDomains[this.currentTabIndex.toString()];
  }

  onSubmit(): void {
    const email = `${this.username}${this.domain}`;
    const selectedPermissionIds = Object.keys(this.selectedPermissions)
                                      .filter(key => this.selectedPermissions[key]);

    const agent = {
      email: email,
      password: this.password,
      permissions: selectedPermissionIds
    };

    this.agentService.createAgent(agent).subscribe(
      agent => {
        console.log('Agent created successfully:', agent);
        this.resetForm();
      },
      error => {
        console.error('Error creating agent:', error);
      }
    );
  }

  resetForm(): void {
    this.username = '';
    this.password = '';
    this.selectedPermissions = {};
  }
}
