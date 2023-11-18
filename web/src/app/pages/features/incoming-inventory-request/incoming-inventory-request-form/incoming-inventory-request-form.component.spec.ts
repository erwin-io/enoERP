import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInventoryRequestFormComponent } from './incoming-inventory-request-form.component';

describe('IncomingInventoryRequestFormComponent', () => {
  let component: IncomingInventoryRequestFormComponent;
  let fixture: ComponentFixture<IncomingInventoryRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingInventoryRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInventoryRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
