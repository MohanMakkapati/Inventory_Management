import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedinventoryComponent } from './deletedinventory.component';

describe('DeletedinventoryComponent', () => {
  let component: DeletedinventoryComponent;
  let fixture: ComponentFixture<DeletedinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
