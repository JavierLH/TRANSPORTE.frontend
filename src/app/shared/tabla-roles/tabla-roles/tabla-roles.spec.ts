import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRoles } from './tabla-roles';

describe('TablaRoles', () => {
  let component: TablaRoles;
  let fixture: ComponentFixture<TablaRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
