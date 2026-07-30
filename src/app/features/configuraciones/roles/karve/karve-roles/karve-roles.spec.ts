import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarveRoles } from './karve-roles';

describe('KarveRoles', () => {
  let component: KarveRoles;
  let fixture: ComponentFixture<KarveRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarveRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarveRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
