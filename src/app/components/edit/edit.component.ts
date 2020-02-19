import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { Record, RecordCategory } from 'src/app/models/record';
import { DateHelper } from 'src/app/utils/helper';
import { IQueryParams } from 'src/app/interfaces/general-interfaces';
import { MatTableDataSource } from '@angular/material';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { EditModalComponent } from 'src/app/components/edit-modal/edit-modal.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // #region Properties

  dsRecords: MatTableDataSource<Record>;
  queryParams: IQueryParams;
  displayedColumns: string[] = ['duration', 'category', 'edit'];

  // #endregion Properties

  // #region Hooks

  constructor(
    private route: ActivatedRoute,
    private store: StoreService,
    public dialog: MatDialog
  ) {
    this.dsRecords = new MatTableDataSource<Record>();
  }

  ngOnInit() {
    const year = Number(this.route.snapshot.paramMap.get('year'));
    const day = Number(this.route.snapshot.paramMap.get('day'));
    this.queryParams = {
      year,
      day,
      date: DateHelper.constructDate(year, day)
    };
    const records = this.store.getRecords(year, day);
    console.log(records);
    this.dsRecords.data = records;
  }

  // #endregion Hooks

  // #region Methods

  public edit(record: Record): void {
    const dialogRef = this.dialog.open(EditModalComponent, {
      //width: '250px',
      data: {
        record: record
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

  public deleteRecord(record: Record) {
    this.dsRecords.data = this.store.deleteRecord(
      record,
      this.queryParams.year,
      this.queryParams.day
    );
  }

  // #endregion Methods
}
