import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFiltros } from './card-filtros';

describe('CardFiltros', () => {
  let component: CardFiltros;
  let fixture: ComponentFixture<CardFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFiltros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardFiltros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
