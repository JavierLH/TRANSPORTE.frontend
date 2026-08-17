import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinPermisos } from './sin-permisos';

describe('SinPermisos', () => {
  let component: SinPermisos;
  let fixture: ComponentFixture<SinPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinPermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinPermisos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
