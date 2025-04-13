import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import {AboutstocksmartComponent } from './components/aboutstocksmart/aboutstocksmart.component';
import { InventorypageComponent } from './components/inventorypage/inventorypage.component';
import { SupplierspageComponent } from './components/supplierspage/supplierspage.component';

// These are the components for each inventory action:
import { AddinventoryComponent } from './components/inventory/addinventory/addinventory.component';
import { UpdateinventoryComponent } from './components/inventory/updateinventory/updateinventory.component';
import { DeleteinventoryComponent } from './components/inventory/deleteinventory/deleteinventory.component';
import { ViewinventoryComponent } from './components/inventory/viewinventory/viewinventory.component';
import { FilterinventoryComponent } from './components/inventory/filterinventory/filterinventory.component';
import { DeletedinventoryComponent } from './components/inventory/deletedinventory/deletedinventory.component';
import { ViewdepartmentsComponent } from './components/inventory/viewdepartments/viewdepartments.component';
import { IssueinventoryComponent } from './components/inventory/issueinventory/issueinventory.component';
import { ViewissuedlistComponent } from './components/inventory/viewissuedlist/viewissuedlist.component';
// These are the components for each suppliers action:
import { AddsupplierComponent } from './components/suppliers/addsupplier/addsupplier.component';
import { UpdatesupplierComponent } from './components/suppliers/updatesupplier/updatesupplier.component';
import { DeletesupplierComponent } from './components/suppliers/deletesupplier/deletesupplier.component';
import { ViewsupplierComponent } from './components/suppliers/viewsupplier/viewsupplier.component';
import { FiltersuppliersComponent } from './components/suppliers/filtersuppliers/filtersuppliers.component';

export const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'about', component: AboutstocksmartComponent },
  { path: 'inventorypage', component: InventorypageComponent },
  { path: 'supplierspage', component: SupplierspageComponent },
  { path: 'inventory/add', component: AddinventoryComponent },
  { path: 'inventory/update', component: UpdateinventoryComponent },
  { path: 'inventory/delete', component: DeleteinventoryComponent },
  { path: 'inventory/view', component: ViewinventoryComponent },
  { path: 'inventory/filter', component: FilterinventoryComponent },
  { path: 'inventory/issueinventory', component:IssueinventoryComponent},
  { path: 'inventory/issuedlist', component:ViewissuedlistComponent},
  { path: 'inventory/deletedinventory',component:DeletedinventoryComponent},
  { path: 'inventory/viewdepartments',component:ViewdepartmentsComponent},
  { path: 'suppliers/add', component: AddsupplierComponent },
  { path: 'suppliers/update', component: UpdatesupplierComponent },
  { path: 'suppliers/delete', component: DeletesupplierComponent },
  { path: 'suppliers/view', component: ViewsupplierComponent },
  { path: 'suppliers/filter', component: FiltersuppliersComponent }
];