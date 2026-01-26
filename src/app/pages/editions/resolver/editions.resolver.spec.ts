import { TestBed } from '@angular/core/testing';

import { EditionsResolver } from './editions.resolver';

describe('EditionsResolver', () => {
  let resolver: EditionsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EditionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
