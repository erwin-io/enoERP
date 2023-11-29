import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIssueItemComponent } from './goods-issue-items.component';

describe('GoodsIssueItemComponent', () => {
  let component: GoodsIssueItemComponent;
  let fixture: ComponentFixture<GoodsIssueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsIssueItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsIssueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
