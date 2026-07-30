import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetcaPermisos } from './letca-permisos';

describe('LetcaPermisos', () => {
  let component: LetcaPermisos;
  let fixture: ComponentFixture<LetcaPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetcaPermisos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetcaPermisos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
