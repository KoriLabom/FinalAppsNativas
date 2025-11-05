import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBadgesComponent } from './product-badges.component';

describe('ProductBadgesComponent', () => {
  let component: ProductBadgesComponent;
  let fixture: ComponentFixture<ProductBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBadgesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
