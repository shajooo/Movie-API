import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cineverse } from './cineverse';

describe('Cineverse', () => {
  let component: Cineverse;
  let fixture: ComponentFixture<Cineverse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cineverse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cineverse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
