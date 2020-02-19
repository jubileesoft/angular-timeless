import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from 'src/app/services/store.service';
import { Record } from 'src/app/models/record';

export interface IEditModalData {
  record: Record;
  year: number;
  day: number;
}

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEditModalData,
    private store: StoreService
  ) {}

  ngOnInit(): void {}

  public changeRecordStart(addMinutes: number) {
    this.store.changeRecordStart(
      this.data.record,
      addMinutes,
      this.data.year,
      this.data.day
    );
  }

  public changeRecordEnd(addMinutes: number) {
    this.store.changeRecordEnd(
      this.data.record,
      addMinutes,
      this.data.year,
      this.data.day
    );
  }
}
