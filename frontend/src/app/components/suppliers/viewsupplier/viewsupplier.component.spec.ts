import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsupplierComponent } from './viewsupplier.component';

describe('ViewsupplierComponent', () => {
  let component: ViewsupplierComponent;
  let fixture: ComponentFixture<ViewsupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewsupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
