import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueitemDialogComponent } from './issueitem-dialog.component';

describe('IssueitemDialogComponent', () => {
  let component: IssueitemDialogComponent;
  let fixture: ComponentFixture<IssueitemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueitemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
