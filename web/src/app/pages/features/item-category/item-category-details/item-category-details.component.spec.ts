import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCategoryDetailsComponent } from './item-category-details.component';

describe('ItemCategoryDetailsComponent', () => {
  let component: ItemCategoryDetailsComponent;
  let fixture: ComponentFixture<ItemCategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCategoryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
