import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRapportComponent } from './create-rapport.component';

describe('CreateRapportComponent', () => {
  let component: CreateRapportComponent;
  let fixture: ComponentFixture<CreateRapportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRapportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRapportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
