import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosEmpresas } from './usuarios-empresas';

describe('UsuariosEmpresas', () => {
  let component: UsuariosEmpresas;
  let fixture: ComponentFixture<UsuariosEmpresas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosEmpresas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosEmpresas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
