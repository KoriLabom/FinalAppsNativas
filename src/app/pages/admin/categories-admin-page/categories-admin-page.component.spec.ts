import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesAdminPageComponent } from './categories-admin-page.component';

describe('CategoriesAdminPageComponent', () => {
  let component: CategoriesAdminPageComponent;
  let fixture: ComponentFixture<CategoriesAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesAdminPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
