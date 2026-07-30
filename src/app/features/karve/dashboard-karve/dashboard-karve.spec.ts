import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKarve } from './dashboard-karve';

describe('DashboardKarve', () => {
  let component: DashboardKarve;
  let fixture: ComponentFixture<DashboardKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
