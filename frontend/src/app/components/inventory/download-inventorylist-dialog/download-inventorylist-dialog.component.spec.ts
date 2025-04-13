import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadInventorylistDialogComponent } from './download-inventorylist-dialog.component';

describe('DownloadInventorylistDialogComponent', () => {
  let component: DownloadInventorylistDialogComponent;
  let fixture: ComponentFixture<DownloadInventorylistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadInventorylistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadInventorylistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
