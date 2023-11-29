import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsIssueDetailsComponent } from './goods-issue-details.component';

describe('GoodsIssueDetailsComponent', () => {
  let component: GoodsIssueDetailsComponent;
  let fixture: ComponentFixture<GoodsIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoodsIssueDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
