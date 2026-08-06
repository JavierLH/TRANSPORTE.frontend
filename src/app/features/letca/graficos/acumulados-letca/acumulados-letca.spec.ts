import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladosLetca } from './acumulados-letca';

describe('AcumuladosLetca', () => {
  let component: AcumuladosLetca;
  let fixture: ComponentFixture<AcumuladosLetca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcumuladosLetca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcumuladosLetca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
