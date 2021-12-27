import { TestBed } from '@angular/core/testing';

import { SecretSantaApiService } from './secret-santa-api.service';

describe('SecretSantaApiService', () => {
  let service: SecretSantaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretSantaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
