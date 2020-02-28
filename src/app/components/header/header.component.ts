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

  onSettings() {
    this.router.navigate(['/settings']);
  }

  // #endregion Methods
}
