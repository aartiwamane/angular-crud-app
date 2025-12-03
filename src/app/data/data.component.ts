import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  employees: any[] = [];
  newEmp = { name: '', position: '', department: '' };

  isEditing = false;
  editEmpId: string | null = null;
  private apiUrl = 'https://employee-crud-backend-exj6.onrender.com/Employee';

  // Make http a class property by adding `private`
  constructor(private empService: DataService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  // Fetch employees
  getEmployees() {
    this.empService.getEmployees().subscribe((data: any[]) => {
      this.employees = data;
    });
  }

  // Add Employee
  addEmployee(): void {
    this.empService.addEmployee(this.newEmp).subscribe((response: any) => {
      this.employees.push({ ...this.newEmp }); // Assuming backend returns the added employee
      this.newEmp = { name: '', position: '', department: '' };
    });
  }

  // Delete Employee using HttpClient directly
  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.getEmployees(); // Refresh list after delete
      });
    }
  }

   editEmployee(emp: any) {
  this.isEditing = true;
  this.editEmpId = emp._id;
  this.newEmp = { name: emp.name, position: emp.position, department: emp.department };
}

updateEmployee() {
  if (this.editEmpId) {

    const updatedData = {
      name: this.newEmp.name,
      position: this.newEmp.position,
      department: this.newEmp.department
    };

    this.empService.updateEmployee(this.editEmpId, updatedData).subscribe(
      (res) => {
        console.log("Employee updated:", res);

        this.getEmployees(); // refresh list
        this.isEditing = false; // exit edit mode
        this.editEmpId = null; // reset selected id

        // reset form
        this.newEmp = { 
          name: '', 
          position: '', 
          department: '' 
        };
      },
      (error) => {
        console.error("Error updating employee:", error);
      }
    );
  }
}


cancelEdit() {
    this.isEditing = false;
    this.editEmpId = null;
    this.newEmp = { name: '', position: '', department: '' };
  }
}