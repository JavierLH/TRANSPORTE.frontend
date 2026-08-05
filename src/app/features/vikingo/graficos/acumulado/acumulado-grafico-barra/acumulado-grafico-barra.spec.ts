import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladoGraficoBarra } from './acumulado-grafico-barra';

describe('AcumuladoGraficoBarra', () => {
  let component: AcumuladoGraficoBarra;
  let fixture: ComponentFixture<AcumuladoGraficoBarra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcumuladoGraficoBarra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcumuladoGraficoBarra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
