import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlViajes } from './control-viajes';

describe('ControlViajes', () => {
  let component: ControlViajes;
  let fixture: ComponentFixture<ControlViajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlViajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlViajes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
