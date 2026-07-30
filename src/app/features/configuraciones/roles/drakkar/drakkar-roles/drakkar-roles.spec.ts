import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrakkarRoles } from './drakkar-roles';

describe('DrakkarRoles', () => {
  let component: DrakkarRoles;
  let fixture: ComponentFixture<DrakkarRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrakkarRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrakkarRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
