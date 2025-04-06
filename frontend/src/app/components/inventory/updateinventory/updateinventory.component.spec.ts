import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateinventoryComponent } from './updateinventory.component';

describe('UpdateinventoryComponent', () => {
  let component: UpdateinventoryComponent;
  let fixture: ComponentFixture<UpdateinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
