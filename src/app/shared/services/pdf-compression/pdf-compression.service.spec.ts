import { TestBed } from '@angular/core/testing';

import { PdfCompressionService } from './pdf-compression.service';

describe('PdfCompressionService', () => {
  let service: PdfCompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfCompressionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
