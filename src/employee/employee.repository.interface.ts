import { Employee } from "./employee.entity.js";

export interface EmployeeRepository {
    findAll(): Promise<Employee[] | undefined>;
    findOne(id: string): Promise<Employee | undefined>;
    add(Employee: Employee): Promise<Employee | undefined>;
    update(id: string, Employee: Employee): Promise<Employee | undefined>;
    partialUpdate(id: string, updates: Partial<Employee>): Promise<Employee | undefined>;
    delete(id: string): Promise<Employee | undefined>;

    logOvertime(id: string, hours: number): Promise<Employee | undefined>;

    
    addEventuality(
        employeeId: string,
        event: { type: string; description: string; date: string }
    ): Promise<boolean>;
}
