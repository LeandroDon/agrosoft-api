import crypto from 'node:crypto'

export class Employee {
    public id: string;

    constructor(
        public fullName: string,           
        public role: string,                 
        public seniority: number,            
        public availableHours: number,
        public salary: number,       
        public overtimeHours: number,        
        public performanceScore: number,     
        public assignedTasks: string[],
        id?: string
      ) {
        this.id = id ?? crypto.randomUUID();
      }

    addTask(task: string) {
        this.assignedTasks.push(task);
    }

    logOvertime(hours: number) {
        this.overtimeHours += hours;
    }

    deactivate() {
        this.availableHours = 0;
        this.assignedTasks = [];
    }

    reassignTask(index: number, newTask: string) {
        if (this.assignedTasks[index]) {
            this.assignedTasks[index] = newTask;
        }
    }

   updateDetails(details: Partial<Employee>) {
        Object.assign(this, details);
    }

    getSummary() {
        return {
            fullName: this.fullName,
            role: this.role,
            seniority: this.seniority,
            availableHours: this.availableHours,
            salary: this.salary,
            overtimeHours: this.overtimeHours,
            performanceScore: this.performanceScore,
            assignedTasks: this.assignedTasks,
            id: this.id
        };
    }
}
