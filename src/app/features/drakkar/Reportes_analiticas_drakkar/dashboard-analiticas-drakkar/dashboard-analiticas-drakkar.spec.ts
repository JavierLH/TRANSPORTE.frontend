import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnaliticasDrakkar } from './dashboard-analiticas-drakkar';

describe('DashboardAnaliticasDrakkar', () => {
  let component: DashboardAnaliticasDrakkar;
  let fixture: ComponentFixture<DashboardAnaliticasDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAnaliticasDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAnaliticasDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
