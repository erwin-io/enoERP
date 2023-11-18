import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestFormComponent } from './inventory-request-form.component';

describe('InventoryRequestFormComponent', () => {
  let component: InventoryRequestFormComponent;
  let fixture: ComponentFixture<InventoryRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryRequestFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
