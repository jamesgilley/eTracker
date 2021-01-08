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

let con
const connectToDb = async(database) => {
    const options = {
        host: "localhost",
        user: "root",
        password: "password",
        database
    }
    try {
        con = mysql.createConnection(options)
        await sqlQuery('show tables')
    } catch (ex) {
        if (ex.errno === 1049) {
            options.database = 'sys'
            console.log('connecting to sys')
            con = mysql.createConnection(options)
            console.log('creating db ', database)
            await sqlQuery(`create database ${database}`)
            options.database = database
            console.log('connecting to ', database)
            con = mysql.createConnection(options)
        }
    }
}

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

const insertRoles = async(roles) => {
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        var sql = "INSERT INTO roles ( title, salary, departmentId) VALUES ( ?, ?, ?)";
        const { roleTitle, roleSalary, role_department_id } = role;
        const args = [roleTitle, roleSalary, role_department_id]
        await sqlQuery(sql, args)
        console.log('inserted role', i);
    }
}

const insertDepartments = async(departments) => {
    for (let i = 0; i < departments.length; i++) {
        const department = departments[i];
        var sql = "INSERT INTO departments ( name) VALUES ( ?)";
        const { departmentName } = department;
        const args = [departmentName]
        await sqlQuery(sql, args)
        console.log('inserted department', i);
    }
}

const main = async(doesReset) => {
    await connectToDb('mydb')
    if (doesReset) {
        await resetDatabase();
    }

    const operationResponse = await promptOperationType();
    console.log('operationResponse', operationResponse);

    if (operationResponse.operationType == "Add Employee Data") {

        const quantityResponse = await promptQuantity();
        console.log('quantityResponse', quantityResponse);

        const employeesResponse = await promptEmployees(quantityResponse.numEmployees);
        await insertEmployees(employeesResponse);
        console.log('inserted', employeesResponse.length, 'employees');
        localStorage.set('employeesResponse', employeesResponse);
        //console.log('employeesResponse:')
        //console.log(employeesResponse)

        const rolesResponse = await promptRoles(quantityResponse.numRoles);
        await insertRoles(rolesResponse);
        console.log('inserted', rolesResponse.length, 'roles');
        localStorage.set('rolesResponse', rolesResponse);
        /* console.log('rolesResponse:')
        console.log(rolesResponse) */

        const departmentsResponse = await promptDepartments(quantityResponse.numDepartments);
        await insertDepartments(departmentsResponse);
        console.log('inserted', departmentsResponse.length, 'departments');
        localStorage.set('departmentsResponse', departmentsResponse);
        /* console.log('departmentsResponse:')
        console.log(departmentsResponse) */
        main(false);
    } else if (operationResponse.operationType == "Delete All Employee Data") {
        await sqlQuery('delete from employees')
        await sqlQuery('delete from roles')
        await sqlQuery('delete from departments')
            //resetDatabase();
        console.log('All Employee Data Deleted')
        main(false);
    } else if (operationResponse.operationType == "View All Employee Data") {
        console.log('Employee, Role, and Department Data to View:')

        let employeesData = await sqlQuery('select * from employees')
        console.table(employeesData)
        let rolesData = await sqlQuery('select * from roles')
        console.table(rolesData)
        let departmentsData = await sqlQuery('select * from departments')
        console.table(departmentsData)


        console.log('All Employee, Role, and Department Data Viewed')
        main(false);
    } else if (operationResponse.operationType == "Update Any Employee Data") {
        console.log('update all data called')
        const data = await promptUpdateTable();
        console.log(data)
        if (data.updateTable == 'Employees') {
            const employeeData = (await promptEmployees(1))[0]
            console.log(employeeData)
            await sqlQuery('update employees SET first_name=?, last_name=?, role_id=?, manager_id=? where id=?', [employeeData.employeeFirstName, employeeData.employeeLastName, employeeData.role_id, employeeData.manager_id, data.updateId])

        } else if (data.updateTable == 'Roles') {
            const roleData = (await promptRoles(1))[0]
            console.log(roleData)
            await sqlQuery('update roles SET title=?, salary=?, departmentId=? where id=?', [roleData.roleTitle, roleData.roleSalary, roleData.role_department_id, data.updateId])
        } else if (data.updateTable == 'Departments') {
            const departmentData = (await promptDepartments(1))[0]
            console.log(departmentData)
            await sqlQuery('update departments SET name=? where id=?', [departmentData.departmentName, data.updateId])

        }

        main(false);
    }

}



const sqlQuery = (sql, args) => {
    return new Promise((resolve, reject) => {
        con.query(sql, args, function(err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result)
        })
    })
}


const resetDatabase = async() => {
    const existsDB = await sqlQuery("show databases like 'mydb'");
    if (!existsDB.length) {
        await sqlQuery("create database mydb")
    }

    const existsEmployees = await sqlQuery("show tables from mydb like 'employees'")
    if (existsEmployees.length > 0) {
        var sql = "DROP TABLE employees"
        await sqlQuery(sql);
        console.log("employee Table dropped");
    }

    var sql = "CREATE TABLE employees (first_name VARCHAR(30), last_name VARCHAR(30), id INT AUTO_INCREMENT PRIMARY KEY, role_id INT, manager_id INT)";
    await sqlQuery(sql);
    console.log("employee Table created");

    const existsRoles = await sqlQuery("show tables from mydb like 'roles'")
    if (existsRoles.length > 0) {
        var sql = "DROP TABLE roles"
        await sqlQuery(sql);
        console.log("roles Table dropped");
    }

    var sql = "CREATE TABLE roles (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(30), salary DECIMAL, departmentId INT)";
    await sqlQuery(sql);
    console.log("Role Table created");

    const existsDepartments = await sqlQuery("show tables from mydb like 'departments'")
    if (existsDepartments.length > 0) {
        var sql = "DROP TABLE departments"
        await sqlQuery(sql);
        console.log("departments Table dropped");
    }
    var sql = "CREATE TABLE departments (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))";
    await sqlQuery(sql);
    console.log("Department Table created");
}

// we only want to reset the database, when we first run the app
main(true);