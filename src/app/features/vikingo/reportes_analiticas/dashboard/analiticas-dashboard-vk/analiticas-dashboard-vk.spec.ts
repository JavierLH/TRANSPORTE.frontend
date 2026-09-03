import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticasDashboardVK } from './analiticas-dashboard-vk';

describe('AnaliticasDashboardVK', () => {
  let component: AnaliticasDashboardVK;
  let fixture: ComponentFixture<AnaliticasDashboardVK>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliticasDashboardVK]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticasDashboardVK);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
