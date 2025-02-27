// Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);
// Starting Question
function startingQuestion() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choices',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ],
            },
        ])
        .then(function (answers) {
            switch (answers.choices) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    console.log('Good-Bye!');
                    db.end();
                    break;
            }
        });
}
                

// Viewing
function viewDepartments() {
    db.query('SELECT * FROM department',
        function (err, results) {
            if (err) throw err;
            console.table(results);
            startingQuestion();
        });
    const sql = `SELECT department.id, department.name AS Department FROM department;`
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
            startingQuestion();
    });
}

function viewRoles() {
    db.query("SELECT * FROM role",
        function (err, results) {
            if (err) throw err;
            console.table(results);
            startingQuestion()
        });
    const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id);`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
            startingQuestion();
        });
}


function viewEmployees() {
    db.query("SELECT * FROM employee",
        function (err, results) {
            if (err) throw err;
            console.table(results);
            startingQuestion()
        });
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
            startingQuestion();
        });
        }
    
// Adding
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: "What is the name of the department?",
            },
        ])
        .then(function (answers) {
            console.log("Added " + answers.department + " to the database")
            addNewDepartment(answers.department);
        });
}
function addNewDepartment(name) {
    var sql = `INSERT INTO department (name) VALUES ('${name}')`;
    db.query(sql, function (err, results) {
        if (err) {
            console.log("Error message: " + err)
            startingQuestion();
        }
    });
}

function addRole() {
    const sql2 = `SELECT * FROM department`;
    db.query(sql2, (error, response) => {
        departmentList = response.map(departments => ({
            name: departments.name,
            value: departments.id
        }));
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which Department does the role belong to?',
                choices: departmentList,
            },
        ]).then((answers) => {
            const sql = `INSERT INTO role SET title='${answers.title}', salary=${answers.salary}, department_id=${answers.department};`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Added " + answers.title + " to the database");
                startingQuestion();
            });
        });
    });
}

function addEmployee() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));
        const sql3 = `SELECT * FROM role`;
        db.query(sql3, (error, response) => {
            roleList = response.map(role => ({
                name: role.title,
                value: role.id
            }));
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name='${answers.last}', role_id=${answers.role}, manager_id=${answers.manager};`;
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Added " + answers.first + " " + answers.last + " to the database");
                    startingQuestion();
                });
            });
        });
    });
}
function addEmployee() {
    const sql2 = `SELECT * FROM employee`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));
        const sql3 = `SELECT * FROM role`;
        db.query(sql3, (error, response) => {
            roleList = response.map(role => ({
                name: role.title,
                value: role.id
            }));
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name='${answers.last}', role_id=${answers.role}, manager_id=${answers.manager};`;
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Added " + answers.first + " " + answers.last + " to the database");
                    startingQuestion();
                });
            });
        });
    });
}

function updateEmployeeRole(employee, role) {
    let name = employee.split(" ");
    let first = name[0];
    let last = name[1]
    sql = `UPDATE employee JOIN role SET role.title = '${role}' WHERE employee.first_name = '${first}' AND employee.last_name = '${last}' AND role.id = employee.role_id LIMIT 1;`;
    db.query(sql, function (err, results) {
        if (err) {
            console.log("Error message: " + err)
        }
        console.log("Employee role updated!")
        startingQuestion();
    });
}

startingQuestion();