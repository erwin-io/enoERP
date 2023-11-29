import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIssueFormComponent } from './goods-issue-form.component';

describe('GoodsIssueFormComponent', () => {
  let component: GoodsIssueFormComponent;
  let fixture: ComponentFixture<GoodsIssueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsIssueFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsIssueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
