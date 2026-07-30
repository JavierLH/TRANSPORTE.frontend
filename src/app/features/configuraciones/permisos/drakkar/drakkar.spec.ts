import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drakkar } from './drakkar';

describe('Drakkar', () => {
  let component: Drakkar;
  let fixture: ComponentFixture<Drakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Drakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
