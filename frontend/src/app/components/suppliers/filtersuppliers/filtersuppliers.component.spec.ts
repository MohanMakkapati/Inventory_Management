import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersuppliersComponent } from './filtersuppliers.component';

describe('FiltersuppliersComponent', () => {
  let component: FiltersuppliersComponent;
  let fixture: ComponentFixture<FiltersuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
