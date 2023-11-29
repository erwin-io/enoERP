import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentConfirmationItemComponent } from './adjustment-confirmation-items.component';

describe('AdjustmentConfirmationItemComponent', () => {
  let component: AdjustmentConfirmationItemComponent;
  let fixture: ComponentFixture<AdjustmentConfirmationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentConfirmationItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentConfirmationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
