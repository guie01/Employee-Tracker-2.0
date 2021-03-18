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
          updateRole();
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

function addEmployee() {
    inquirer
      .prompt([
        {
            type: 'input',
            message: "What is the employee ID?",
            name: "id",
          },
        {
          type: 'input',
          message: "What is the first name?",
          name: "firstName",
        },
        {
          type: "input",
          message: "What is the last name?",
          name: "lastName",
        },
        {
          type: "input",
          message: "What is the employee's role ID?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the employee's manager ID?",
          name: "manager",
        }
      ]).then(function (response) {
        console.log(response)
        insertEmployeeData(response)
      })
  }
  
  function insertEmployeeData(data) {
  
    connection.query("INSERT INTO employee SET ?",
      {
        id: data.id,  
        first_name: data.firstName,
        last_name: data.lastName,
        role_id: data.title,
        manager_id: data.manager
      }, function (error, res) {
        if (error) throw error;
        mainmenu();
      })
      
  }

  function addDept() {
    inquirer
      .prompt([
        {
            type: 'input',
            message: "What is the department ID?",
            name: "id",
          },
        {
          type: 'input',
          message: "What is the department name?",
          name: "name",
        },
      ]).then(function (response) {
        console.log(response)
        insertDepartmentData(response)
      })
  }
  
  function insertDepartmentData(data) {
  
    connection.query("INSERT INTO department SET ?",
      {
        id: data.id,  
        dept_name: data.name,
      }, function (error, res) {
        if (error) throw error;
        mainmenu();
      })
  }

  function addRole() {
    inquirer
      .prompt([
        {
            type: 'input',
            message: "What is the role ID?",
            name: "id",
          },
        {
          type: 'input',
          message: "What is the role title?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the expected salary?",
          name: "salary",
        },
        {
          type: "input",
          message: "What is the associated department ID?",
          name: "deptarment",
        },
      ]).then(function (response) {
        console.log(response)
        insertRoleData(response)
      })
  }
  
  function insertRoleData(data) {
  
    connection.query("INSERT INTO roles SET ?",
      {
        id: data.id,  
        role_title: data.title,
        salary: data.salary,
        dep_id: data.department,
      }, function (error, res) {
        if (error) throw error;
        mainmenu();
      })
      
  }

  function updateRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "For which employee would you like to update the role?",
          name: "empID",
        },
        {
          type: "input",
          message: "What is the employee's new role?",
          name: "titleID",
        }
      ])
      .then(function (response) {
        console.log(response);
        updateEmployeeRole(response);
      })
  }
  
  function updateEmployeeRole(data) {
    connection.query(`UPDATE employee SET role_id = ${data.titleID} WHERE id = ${data.empID}`,
    function (error, res) {
      console.log(error, res);
      if (error) throw error;
      mainmenu();
    });
    
  }