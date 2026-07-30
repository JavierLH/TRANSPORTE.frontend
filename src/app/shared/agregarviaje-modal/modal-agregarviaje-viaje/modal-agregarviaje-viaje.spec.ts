import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarviajeViaje } from './modal-agregarviaje-viaje';

describe('ModalAgregarviajeViaje', () => {
  let component: ModalAgregarviajeViaje;
  let fixture: ComponentFixture<ModalAgregarviajeViaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarviajeViaje]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarviajeViaje);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
