import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewinventorybysupplieridComponent } from './viewinventorybysupplierid.component';

describe('ViewinventorybysupplieridComponent', () => {
  let component: ViewinventorybysupplieridComponent;
  let fixture: ComponentFixture<ViewinventorybysupplieridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewinventorybysupplieridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewinventorybysupplieridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
