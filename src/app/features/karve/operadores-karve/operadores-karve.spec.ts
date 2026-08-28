import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadoresKarve } from './operadores-karve';

describe('OperadoresKarve', () => {
  let component: OperadoresKarve;
  let fixture: ComponentFixture<OperadoresKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadoresKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadoresKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
