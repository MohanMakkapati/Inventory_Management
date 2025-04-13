import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSupplierslistDialogComponent } from './download-supplierslist-dialog.component';

describe('DownloadSupplierslistDialogComponent', () => {
  let component: DownloadSupplierslistDialogComponent;
  let fixture: ComponentFixture<DownloadSupplierslistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadSupplierslistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadSupplierslistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
