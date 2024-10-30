import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmeTaskComponent } from './confirme-task.component';

describe('ConfirmeTaskComponent', () => {
  let component: ConfirmeTaskComponent;
  let fixture: ComponentFixture<ConfirmeTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmeTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
