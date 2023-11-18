import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInventoryRequestComponent } from './incoming-inventory-request.component';

describe('IncomingInventoryRequestComponent', () => {
  let component: IncomingInventoryRequestComponent;
  let fixture: ComponentFixture<IncomingInventoryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingInventoryRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInventoryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
