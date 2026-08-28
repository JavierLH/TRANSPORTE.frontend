import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadoresVikingo } from './operadores-vikingo';

describe('OperadoresVikingo', () => {
  let component: OperadoresVikingo;
  let fixture: ComponentFixture<OperadoresVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadoresVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadoresVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
