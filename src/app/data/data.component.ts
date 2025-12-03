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
  console.log('editEmployee clicked for:', emp);
  this.isEditing = true;
  // make sure id exists
  this.editEmpId = emp._id || emp.id || null;
  console.log('using editEmpId =', this.editEmpId);
  this.newEmp = { name: emp.name, position: emp.position, department: emp.department };
}

updateEmployee() {
  if (!this.editEmpId) {
    console.error('No editEmpId set — cannot update');
    return;
  }

  const updatedData = {
    name: this.newEmp.name,
    position: this.newEmp.position,
    department: this.newEmp.department
  };

  console.log('Sending PUT to:', `${this.apiUrl}/${this.editEmpId}`);
  console.log('Payload:', updatedData);

  this.empService.updateEmployee(this.editEmpId, updatedData).subscribe(
    (res) => {
      console.log('Update success response:', res);
      this.getEmployees();
      this.isEditing = false;
      this.editEmpId = null;
      this.newEmp = { name: '', position: '', department: '' };
    },
    (err) => {
      console.error('Update error:', err);
      alert('Update failed — check console for error');
    }
  );
}


cancelEdit() {
    this.isEditing = false;
    this.editEmpId = null;
    this.newEmp = { name: '', position: '', department: '' };
  }
}