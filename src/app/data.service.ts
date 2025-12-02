import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://employee-crud-backend-exj6.onrender.com/Employee';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addEmployee(emp: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emp);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateEmployee(id: string, empData: any) {
  return this.http.put(`${this.apiUrl}/${id}`, empData);
}

}
