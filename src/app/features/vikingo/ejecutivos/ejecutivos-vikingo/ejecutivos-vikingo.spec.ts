import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivosVikingo } from './ejecutivos-vikingo';

describe('EjecutivosVikingo', () => {
  let component: EjecutivosVikingo;
  let fixture: ComponentFixture<EjecutivosVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecutivosVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecutivosVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
