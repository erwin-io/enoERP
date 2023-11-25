import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInventoryRequestClosedComponent } from './incoming-inventory-request-closed.component';

describe('IncomingInventoryRequestClosedComponent', () => {
  let component: IncomingInventoryRequestClosedComponent;
  let fixture: ComponentFixture<IncomingInventoryRequestClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingInventoryRequestClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInventoryRequestClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
