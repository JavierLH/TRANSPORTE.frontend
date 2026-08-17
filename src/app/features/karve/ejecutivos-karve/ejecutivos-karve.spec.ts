import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivosKarve } from './ejecutivos-karve';

describe('EjecutivosKarve', () => {
  let component: EjecutivosKarve;
  let fixture: ComponentFixture<EjecutivosKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecutivosKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecutivosKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
