import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInventoryRequestItemComponent } from './incoming-inventory-request-items.component';

describe('IncomingInventoryRequestItemComponent', () => {
  let component: IncomingInventoryRequestItemComponent;
  let fixture: ComponentFixture<IncomingInventoryRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingInventoryRequestItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInventoryRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
