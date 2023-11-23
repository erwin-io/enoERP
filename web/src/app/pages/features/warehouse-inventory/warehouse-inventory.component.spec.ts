import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMasterlistComponent } from './warehouse-inventory.component';

describe('InventoryMasterlistComponent', () => {
  let component: InventoryMasterlistComponent;
  let fixture: ComponentFixture<InventoryMasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryMasterlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
