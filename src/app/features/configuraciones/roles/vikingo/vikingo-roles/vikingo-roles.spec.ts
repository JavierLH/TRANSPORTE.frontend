import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikingoRoles } from './vikingo-roles';

describe('VikingoRoles', () => {
  let component: VikingoRoles;
  let fixture: ComponentFixture<VikingoRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikingoRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikingoRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
