import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // #region Hooks

  constructor(private store: StoreService, private router: Router) {}

  ngOnInit() {}

  // #endregion Hooks

  // #region Methods

  onLeft() {
    const left = this.store.getLeftDay();
    if (!left) {
      return;
    }
    this.router.navigate(['/day', { year: left[0], day: left[1] }]);
  }

  onRight() {
    const right = this.store.getRightDay();
    if (!right) {
      return;
    }
    this.router.navigate(['/day', { year: right[0], day: right[1] }]);
  }

  // #endregion Methods
}
