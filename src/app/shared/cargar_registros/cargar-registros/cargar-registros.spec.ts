import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarRegistros } from './cargar-registros';

describe('CargarRegistros', () => {
  let component: CargarRegistros;
  let fixture: ComponentFixture<CargarRegistros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarRegistros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarRegistros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
