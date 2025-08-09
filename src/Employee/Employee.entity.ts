

import crypto from 'node:crypto'

export class Employee {

    constructor(
        public fullName: string,             // Employee's full name
        public role: string,                 // Job role or position
        public seniority: number,            // Years of experience or hierarchical level
        public availableHours: number,       // Regular working hours available
        public overtimeHours: number,        // Accumulated overtime hours
        public performanceScore: number,     // Productivity or performance metric
        public assignedTasks: string[]       // List of assigned tasks
    ) {}

    // Add a new task to the employee
    addTask(task: string) {
        this.assignedTasks.push(task);
    }

    // Register additional overtime hours
    logOvertime(hours: number) {
        this.overtimeHours += hours;
    }

    // Mark employee as inactive (e.g., termination or leave)
    deactivate() {
        this.availableHours = 0;
        this.assignedTasks = [];
    }

    // Reassign a task at a specific index
    reassignTask(index: number, newTask: string) {
        if (this.assignedTasks[index]) {
            this.assignedTasks[index] = newTask;
        }
    }

    // Edit employee details
    updateDetails(details: Partial<Employee>) {
        Object.assign(this, details);
    }

    // View employee summary
    getSummary() {
        return {
            fullName: this.fullName,
            role: this.role,
            seniority: this.seniority,
            availableHours: this.availableHours,
            overtimeHours: this.overtimeHours,
            performanceScore: this.performanceScore,
            assignedTasks: this.assignedTasks
        };
    }
}
