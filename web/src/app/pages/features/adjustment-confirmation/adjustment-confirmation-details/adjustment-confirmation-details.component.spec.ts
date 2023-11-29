import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentConfirmationDetailsComponent } from './adjustment-confirmation-details.component';

describe('AdjustmentConfirmationDetailsComponent', () => {
  let component: AdjustmentConfirmationDetailsComponent;
  let fixture: ComponentFixture<AdjustmentConfirmationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentConfirmationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentConfirmationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
