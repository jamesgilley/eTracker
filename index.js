const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
var mysql = require('mysql');
var localStorage = require('local-storage');

/* localStorage('foo', 'bar');
// <- true
 
console.log(localStorage.get('foo'));
//bar */


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

const promptEmployees = async(numEmployees) => {
    const employees = []
    for (let i = 1; i <= numEmployees; i++) {
        console.log('---- employee ', i, '---------')
        const employee = await inquirer.prompt([{
                type: 'input',
                name: `employeeFirstName`,
                message: 'What is the employee first name?'
            },
            {
                type: 'input',
                name: `employeeLastName`,
                message: 'What is the employee last name?'
            },
            /*   {
                type: 'number',
                name: `employeeId`,
                message: 'What is the employee ID?'
              }, */
            {
                type: 'number',
                name: `role_id`,
                message: 'What is the employee role id?'
            },
            {
                type: 'number',
                name: `manager_id`,
                message: 'What is the manager id for the employee?'
            },
        ])
        employees.push(employee)
    }
    return employees

}

const promptRoles = async(numRoles) => {
    const roles = [];
    for (let i = 1; i <= numRoles; i++) {
        console.log('------- role ', i, '-------');
        const role = await inquirer.prompt([
            /*  {
               type: 'number',
               name: `roleId`,
               message: 'What is the role ID?'
             }, */
            {
                type: 'input',
                name: `roleTitle`,
                message: 'What is the role title?'
            },
            {
                type: 'number',
                name: `roleSalary`,
                message: 'What is the role Salary?'
            },
            {
                type: 'number',
                name: `role_department_id`,
                message: 'What is the role department ID?'
            },
        ]);
        roles.push(role);
    }
    return roles;
}

const promptDepartments = async(numDepartments) => {
    const departments = [];
    for (let i = 1; i <= numDepartments; i++) {
        console.log('------- department ', i, '-------');
        const department = await inquirer.prompt([
            /*  {
               type: 'number',
               name: `departmentId`,
               message: 'What is the department ID?'
             }, */
            {
                type: 'input',
                name: `departmentName`,
                message: 'What is the department name?'
            },
        ]);
        departments.push(department);
    }
    return departments;
}



const insertEmployees = async(employees) => {
    for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        var sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        const { employeeFirstName, employeeLastName, role_id, manager_id } = employee;
        var args = [employeeFirstName, employeeLastName, role_id, manager_id];
        await sqlQuery(sql, args)
        console.log('inserted employee', i);
    }
}