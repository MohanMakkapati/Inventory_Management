import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteinventoryComponent } from './deleteinventory.component';

describe('DeleteinventoryComponent', () => {
  let component: DeleteinventoryComponent;
  let fixture: ComponentFixture<DeleteinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
