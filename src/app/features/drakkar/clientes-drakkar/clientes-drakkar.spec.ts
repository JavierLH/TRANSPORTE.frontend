import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesDrakkar } from './clientes-drakkar';

describe('ClientesDrakkar', () => {
  let component: ClientesDrakkar;
  let fixture: ComponentFixture<ClientesDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
