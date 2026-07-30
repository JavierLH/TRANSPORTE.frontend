import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetcaRoles } from './letca-roles';

describe('LetcaRoles', () => {
  let component: LetcaRoles;
  let fixture: ComponentFixture<LetcaRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetcaRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetcaRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
