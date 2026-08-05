import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladoKarve } from './acumulado-karve';

describe('AcumuladoKarve', () => {
  let component: AcumuladoKarve;
  let fixture: ComponentFixture<AcumuladoKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcumuladoKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcumuladoKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
