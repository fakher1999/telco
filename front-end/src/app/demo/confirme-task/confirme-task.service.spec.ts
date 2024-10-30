import { TestBed } from '@angular/core/testing';

import { ConfirmeTaskService } from './confirme-task.service';

describe('ConfirmeTaskService', () => {
  let service: ConfirmeTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmeTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
