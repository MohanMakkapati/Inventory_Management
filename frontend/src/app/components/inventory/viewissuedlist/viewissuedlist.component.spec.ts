import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewissuedlistComponent } from './viewissuedlist.component';

describe('ViewissuedlistComponent', () => {
  let component: ViewissuedlistComponent;
  let fixture: ComponentFixture<ViewissuedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewissuedlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewissuedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
