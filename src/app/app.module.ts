import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { AssignedTransactionsComponent } from './assigned-transactions/assigned-transactions.component';
import { OpenTransactionsComponent } from './open-transactions/open-transactions.component';
import { OpenBillsComponent } from './open-bills/open-bills.component';
import { AssignBillsComponent } from './assign-bills/assign-bills.component';
import { BillsComponent } from './bills/bills.component';
import { InitialTransactionsComponent } from './initial-transactions/initial-transactions.component';
import { InitialBillsComponent } from './initial-bills/initial-bills.component';
import { FilteredTransactionsComponent } from './filtered-transactions/filtered-transactions.component';
import { InvalidMatchesComponent } from './invalid-matches/invalid-matches.component';
import { TransactionsComponent } from './transactions/transactions.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'initialTransactions', component: InitialTransactionsComponent },
  { path: 'assignedTransactions', component: AssignedTransactionsComponent },
  { path: 'filteredTransactions', component: FilteredTransactionsComponent },
  { path: 'openTransactions', component: OpenTransactionsComponent},
  { path: 'initialBills', component: InitialBillsComponent },
  { path: 'assignBills/:id', component: AssignBillsComponent},
  { path: 'openBills', component: OpenBillsComponent },
  { path: 'invalidMatches', component: InvalidMatchesComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AssignedTransactionsComponent,
    OpenTransactionsComponent,
    OpenBillsComponent,
    AssignBillsComponent,
    BillsComponent,
    InitialTransactionsComponent,
    InitialBillsComponent,
    FilteredTransactionsComponent,
    InvalidMatchesComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule { }
