import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddquantitydialogComponent } from './addquantitydialog.component';

describe('AddquantitydialogComponent', () => {
  let component: AddquantitydialogComponent;
  let fixture: ComponentFixture<AddquantitydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddquantitydialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddquantitydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
