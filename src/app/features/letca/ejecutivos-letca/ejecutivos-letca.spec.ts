import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivosLetca } from './ejecutivos-letca';

describe('EjecutivosLetca', () => {
  let component: EjecutivosLetca;
  let fixture: ComponentFixture<EjecutivosLetca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecutivosLetca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecutivosLetca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
