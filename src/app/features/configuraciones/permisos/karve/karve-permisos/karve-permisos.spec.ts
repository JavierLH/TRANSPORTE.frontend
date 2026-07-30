import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarvePermisos } from './karve-permisos';

describe('KarvePermisos', () => {
  let component: KarvePermisos;
  let fixture: ComponentFixture<KarvePermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarvePermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarvePermisos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
