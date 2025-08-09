import Employee from "./Employee.controller.js";

export interface EmployeeRepository {
    findAll(): Promise<Employee[] | undefined>;
    findOne(id: string): Promise<Employee | undefined>;
    add(Employee: Employee): Promise<Employee | undefined>;
    update(id: string, Employee: Employee): Promise<Employee | undefined>;
    partialUpdate(id: string, updates: Partial<Employee>): Promise<Employee | undefined>;
    delete(id: string): Promise<Employee | undefined>;

    // Log overtime hours
    logOvertime(id: string, hours: number): Promise<Employee | undefined>;

    // Register an eventuality
    addEventuality(
        employeeId: string,
        event: { type: string; description: string; date: string }
    ): Promise<boolean>;
}
