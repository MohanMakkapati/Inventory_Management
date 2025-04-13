import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutstocksmartComponent } from './aboutstocksmart.component';

describe('AboutstocksmartComponent', () => {
  let component: AboutstocksmartComponent;
  let fixture: ComponentFixture<AboutstocksmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutstocksmartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutstocksmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
