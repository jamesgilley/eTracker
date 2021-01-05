const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
var mysql = require('mysql');
var localStorage = require('local-storage');
const writeFileAsync = util.promisify(fs.writeFile);

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});
class Employee {
    constructor(first_name, id, last_name, role_id, manager_id) { // Class Constructor 
        this.first_name = first_name;
        this.id = id;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

}

class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Role {
    constructor(id, title, salary, dapartment_id) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

}


const promptOperationType = () =>
    inquirer.prompt([{
        type: 'list',
        name: 'operationType',
        message: 'What type of operation would you like to perform?',
        choices: ["Add Employee Data", "Delete All Employee Data", "View All Employee Data", "Update Any Employee Data"],
    }, ])



const promptUpdateTable = () =>
    inquirer.prompt([{
            type: 'list',
            name: 'updateTable',
            message: 'What table would you like to update?',
            choices: ["Employees", "Roles", "Departments"],
        },
        {
            type: 'number',
            name: 'updateId',
            message: 'Which id would you like to update?'
        },

    ])

const promptQuantity = () =>
    inquirer.prompt([{
            type: 'number',
            name: 'numDepartments',
            message: 'How many departments in the company?',
        },
        {
            type: 'number',
            name: 'numEmployees',
            message: 'How many employees in the company?',
        },
        {
            type: 'number',
            name: 'numRoles',
            message: 'How many roles in the company?',
        },

    ])