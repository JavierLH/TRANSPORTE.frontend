import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladosDrakkar } from './acumulados-drakkar';

describe('AcumuladosDrakkar', () => {
  let component: AcumuladosDrakkar;
  let fixture: ComponentFixture<AcumuladosDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcumuladosDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcumuladosDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
