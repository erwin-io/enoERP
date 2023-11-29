import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentConfirmationClosedComponent } from './adjustment-confirmation-closed.component';

describe('AdjustmentConfirmationClosedComponent', () => {
  let component: AdjustmentConfirmationClosedComponent;
  let fixture: ComponentFixture<AdjustmentConfirmationClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentConfirmationClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentConfirmationClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
