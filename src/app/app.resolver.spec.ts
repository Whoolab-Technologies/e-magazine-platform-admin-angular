import { TestBed } from '@angular/core/testing';

import { InitialDataResolver } from './app.resolver';

describe('AppResolver', () => {
  let resolver: InitialDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InitialDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
