const mysql = require("mysql");
const inquirer = require('inquirer');
const consoletable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'empmanagement_db',
})

connection.connect((err) => {
    if(err) throw err;
    console.log("connected as id " + connection.threadId)
    mainmenu()
}) 

mainmenu = () => {
    inquirer
    .prompt({
      type: "list",
      name: "mainMenu",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.mainMenu) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDept();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

viewAllEmployees = () => {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, roles.role_title, roles.salary from employee LEFT JOIN roles ON employee.role_id = roles.id";
    connection.query(query, function (err, res) {
      console.table(res);
      mainmenu();
    });
}
viewAllDept = () => {
    var query = "SELECT department.id, department.dept_name from department";
    connection.query(query, function (err, res) {
      console.table(res);
      mainmenu();
    });
}
viewAllRoles = () => {
    var query = "SELECT roles.id, roles.role_title, roles.salary, department.dept_name from roles LEFT JOIN department ON roles.dep_id = department.id";
    connection.query(query, function (err, res) {
      console.table(res);
      mainmenu();
    });
}
