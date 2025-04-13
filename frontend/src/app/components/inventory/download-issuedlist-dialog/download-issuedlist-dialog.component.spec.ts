import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIssuedlistDialogComponent } from './download-issuedlist-dialog.component';

describe('DownloadIssuedlistDialogComponent', () => {
  let component: DownloadIssuedlistDialogComponent;
  let fixture: ComponentFixture<DownloadIssuedlistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadIssuedlistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadIssuedlistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
