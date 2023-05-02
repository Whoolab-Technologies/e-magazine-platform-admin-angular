import { TestBed } from '@angular/core/testing';

import { StudentsResolver } from './students.resolver';

describe('StudentsResolver', () => {
  let resolver: StudentsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(StudentsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
