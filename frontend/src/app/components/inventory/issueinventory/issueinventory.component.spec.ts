import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueinventoryComponent } from './issueinventory.component';

describe('IssueinventoryComponent', () => {
  let component: IssueinventoryComponent;
  let fixture: ComponentFixture<IssueinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
