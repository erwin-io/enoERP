import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInventoryRequestDetailsComponent } from './incoming-inventory-request-details.component';

describe('IncomingInventoryRequestDetailsComponent', () => {
  let component: IncomingInventoryRequestDetailsComponent;
  let fixture: ComponentFixture<IncomingInventoryRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingInventoryRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInventoryRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
