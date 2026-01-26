import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionVideoComponent } from './edition-video.component';

describe('EditionVideoComponent', () => {
  let component: EditionVideoComponent;
  let fixture: ComponentFixture<EditionVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
