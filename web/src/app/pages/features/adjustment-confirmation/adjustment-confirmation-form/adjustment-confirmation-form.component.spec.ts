import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentConfirmationFormComponent } from './adjustment-confirmation-form.component';

describe('AdjustmentConfirmationFormComponent', () => {
  let component: AdjustmentConfirmationFormComponent;
  let fixture: ComponentFixture<AdjustmentConfirmationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjustmentConfirmationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentConfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
