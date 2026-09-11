import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinosVikingo } from './destinos-vikingo';

describe('DestinosVikingo', () => {
  let component: DestinosVikingo;
  let fixture: ComponentFixture<DestinosVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinosVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinosVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
