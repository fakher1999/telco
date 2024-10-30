import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HttpClientJsonpModule } from '@angular/common/http';
 
@Component({
  selector: 'app-revenues',
  standalone: true,
  imports: [CardComponent,SharedModule, CommonModule, RouterOutlet, CanvasJSAngularChartsModule,HttpClientJsonpModule],
  templateUrl: './revenues.component.html',
  styleUrl: './revenues.component.scss',
  providers :[],
})
export class RevenuesComponent {
  chartOptions = {
    title: {
      text: 'Monthly Sales Data',
    },
    theme: 'light2',
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
      valueFormatString: '$#,##0k',
    },
    data: [
      {
        type: 'column', //change type to bar, line, area, pie, etc
        yValueFormatString: '$#,##0k',
        color: '#01b8aa',
        dataPoints: [
          { label: 'Jan', y: 172 },
          { label: 'Feb', y: 189 },
          { label: 'Mar', y: 201 },
          { label: 'Apr', y: 240 },
          { label: 'May', y: 166 },
          { label: 'Jun', y: 196 },
          { label: 'Jul', y: 218 },
          { label: 'Aug', y: 167 },
          { label: 'Sep', y: 175 },
          { label: 'Oct', y: 152 },
          { label: 'Nov', y: 156 },
          { label: 'Dec', y: 164 },
        ],
      },
    ],
  };
}       