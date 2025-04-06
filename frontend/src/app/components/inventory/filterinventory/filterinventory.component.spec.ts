import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterinventoryComponent } from './filterinventory.component';

describe('FilterinventoryComponent', () => {
  let component: FilterinventoryComponent;
  let fixture: ComponentFixture<FilterinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
