import { TestBed } from '@angular/core/testing';

import { ClassesResolver } from './classes.resolver';

describe('ClassesResolver', () => {
  let resolver: ClassesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ClassesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
