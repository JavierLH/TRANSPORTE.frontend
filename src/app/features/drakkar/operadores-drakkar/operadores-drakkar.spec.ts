import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadoresDrakkar } from './operadores-drakkar';

describe('OperadoresDrakkar', () => {
  let component: OperadoresDrakkar;
  let fixture: ComponentFixture<OperadoresDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadoresDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadoresDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
