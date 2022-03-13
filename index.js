const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

const baseQuestions = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "userAction",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    .then((projectData) => {
      console.log(projectData);
      switch (projectData.userAction) {
        case "view all departments":
          viewAllDepartments();
          break;

        case "view all roles":
          viewAllRoles();
          break;

        case "view all employees":
          viewAllEmployees();
          break;

        case "add a department":
          addDepartment();
          break;

        case "add an employee":
          addEmployee();
          break;

        case "add a role":
          addRole();
          break;

        case "update an employee role":
          updateEmployee();
          break;
      }
    });
};
const viewAllDepartments = async () => {
  const sql = `SELECT * FROM department`;
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch(console.log);
  console.log("view dep");
  baseQuestions();
};
const viewAllRoles = async () => {
  const sql = 
  'SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id=department.id ORDER BY role.id'
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch(console.log);
  console.log("view role");
  baseQuestions();
};
const viewAllEmployees = async () => {
  const sql = 
  "SELECT a.id, a.first_name, a.last_name, role.title, department.name, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a JOIN role ON a.role_id=role.id JOIN department ON department.id=role.department_id LEFT JOIN employee b ON a.manager_id = b.id";
  await db
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch(console.log);
  console.log("view empl");
  baseQuestions();
};
const addEmployee = async () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the employee name.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's first name?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the employee name.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "role",
        message: "What is the employee's role id?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the employee role id.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "manager_id",
        message: " What is the employee's manager's id?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the employee manager  id.");
            return false;
          }
        },
      },
    ])
    .then((employeeData) => {
      console.log(employeeData);
      db.promise()
        .query(
          "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [
            employeeData.first_name,
            employeeData.last_name,
            employeeData.role,
            employeeData.manager_id,
          ]
        )
        .catch((err) => console.log(err));
      baseQuestions();
    });
};

const addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter your department name.");
            return false;
          }
        },
      },
    ])
    .then((departmentData) => {
      console.log(departmentData.department);
      db.promise()
        .query(
          "INSERT INTO department(name) VALUES (?)",
          departmentData.department
        )
        .catch((err) => console.log(err));
      baseQuestions();
    });
};

const addRole = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the role?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the role name.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the salary.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "department",
        message: "What is the department id?",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the department id.");
            return false;
          }
        },
      },
    ])
    .then((roleData) => {
      db.promise()
        .query("INSERT INTO role(title,salary,department_id) VALUES (?,?,?)", [
          roleData.role,
          roleData.salary,
          roleData.department,
        ])
        .catch((err) => console.log(err));
      baseQuestions();
    });
};
const updateEmployee = () => {
  const sql = `SELECT * FROM role`;
  db.promise()
    .query(sql)
    .then(([rows, fields]) => {
      const roleChoices = rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));
      return roleChoices;
    })
    .then((roleChoices) => {
      const sql = `SELECT * FROM employee`;
      db.promise()
        .query(sql)
        .then(([rows, fields]) => {
          const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));
          return { roleChoices, employeeChoices };
        })

        .then(({ roleChoices, employeeChoices }) => {
          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Select an employee to update",
                choices: employeeChoices,
              },
              {
                type: "list",
                name: "role",
                message: "Select a role",
                choices: roleChoices,
              },
            ])
            .then((response) => {
              db.promise()
                .query("UPDATE employee SET role_id=? WHERE id=?", [
                  response.role,
                  response.employee,
                ])
                .catch((err) => console.log(err));
              baseQuestions();
            });
        });
    });
};

baseQuestions();
