import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { DayComponent } from './components/day/day.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { EditComponent } from './components/edit/edit.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { SettingsComponent } from './components/settings/settings.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DayComponent,
    EditComponent,
    EditModalComponent,
    SettingsComponent
  ],
  entryComponents: [EditModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    MatMenuModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
