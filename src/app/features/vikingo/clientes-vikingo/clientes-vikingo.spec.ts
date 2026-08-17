import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesVikingo } from './clientes-vikingo';

describe('ClientesVikingo', () => {
  let component: ClientesVikingo;
  let fixture: ComponentFixture<ClientesVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
