import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikingoPermisos } from './vikingo-permisos';

describe('VikingoPermisos', () => {
  let component: VikingoPermisos;
  let fixture: ComponentFixture<VikingoPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikingoPermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikingoPermisos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
