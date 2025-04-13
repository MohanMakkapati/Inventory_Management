import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventoryitem } from '../models/inventoryitem.model';
@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:5000/api/inventory'; 

  constructor(private http: HttpClient) {}
  //add new inventory item
  addInventory(inventory: Partial<Inventoryitem>): Observable<any> {
    return this.http.post(this.apiUrl, inventory);
  }

  // Add quantity to an existing item
  addQuantity(id: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/add-quantity/${id}`, { quantityToAdd: Number(quantity)});
  }
  //to update the inventory
  updateInventory(id: number, data: Partial<Inventoryitem>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  
  // to delete the inventory
  deleteInventory(id: number, description: string): Observable<any> {
    return this.http.delete( `${this.apiUrl}/${id}`, { body: { description }});
  }

  // Get all inventory items
  getAllInventory(): Observable<Inventoryitem[]> {
    return this.http.get<Inventoryitem[]>(this.apiUrl);
  }

  //Get all inventory with supplier
  getInventoryWithSuppliers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/details/with-suppliers`);
  }
  
  //Issue inventory by id
  issueInventory(inventoryId: number, departmentId: number, quantityIssued: number): Observable<any> {
    const requestPayload = {
      inventory_id: inventoryId,
      department_id: departmentId,
      quantity_issued: quantityIssued
    };

    return this.http.post<any>(`${this.apiUrl}/issue/byid`, requestPayload);
  }

  //to Get all issued list
  getIssuedInventory() {
    return this.http.get<any[]>(`${this.apiUrl}/issued/details`);
  }

  //to get issued list with inventory and department details
  getIssuedInventoryDepartmentDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/issuedinventorydepartment/details`);
  }
  //Get deleted inventory table list
  getDeletedInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/deleted/details`);
  }

  // Get all depaartments list
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments/details`);
  }
}
