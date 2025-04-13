import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplieritem } from '../models/supplieritem.model';
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private apiUrl = 'http://localhost:5000/api/suppliers';
  
  constructor(private http: HttpClient) {}
  
    // Get all supplier items
    getAllSuppliers(): Observable<Supplieritem[]> {
      return this.http.get<Supplieritem[]>(this.apiUrl);
    }

    // to get supplier by id
    getSupplierById(id: number): Observable<Supplieritem> {
      return this.http.get<Supplieritem>(`${this.apiUrl}/${id}`);
    }

    // to get supplier by name
    getSupplierByName(name: string): Observable<Supplieritem[]> {
      return this.http.get<Supplieritem[]>(`${this.apiUrl}/name/${name}`);
    }    

    //to get suppliers by specific date
    getSuppliersByDate(date: string) {
      return this.http.get<Supplieritem[]>(`${this.apiUrl}/date/${date}`);
    }

    // to get suppliers by daterange
    getSuppliersByDateRange(start: string, end: string) {
      return this.http.get<Supplieritem[]>(`${this.apiUrl}/daterange?start=${start}&end=${end}`);
    }

    //to add the supplier 
    addSupplier(supplier: Supplieritem): Observable<any> {
      return this.http.post(this.apiUrl, supplier);
    }
    //to delete supplier
    deleteSupplier(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
    //to update the supplier
    updateSupplier(id: number, data: Partial<Supplieritem>): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, data);
    }    

    // to inventory by the ssupplier id
    getInventoryBySupplierId(id: number) {
      return this.http.get<any[]>(`${this.apiUrl}/inventory/${id}`);
    }
    
}
