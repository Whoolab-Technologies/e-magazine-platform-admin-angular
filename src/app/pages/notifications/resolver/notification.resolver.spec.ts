import { TestBed } from '@angular/core/testing';

import { NotificationResolver } from './notification.resolver';

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NotificationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
