const mysql = require('mysql');
const util = require("util")
const inquirer = require('inquirer');
const { SlowBuffer } = require('buffer');
const cTable = require('console.table');  

var deplist=[];
var rolelist=[];

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '99Humble',
  database: 'employee_manager',
});
connection.query = util.promisify(connection.query);

connection.connect((err) => {
  if (err) throw err;
  connection.query("SELECT * FROM department", (err, res) =>{
    if (err) throw err;//console.log(res);
     deplist = res.map((item) => ({ name: item.dep_name, value: item.department_id }));
  });
  connection.query("SELECT * FROM roletype", (err, res) =>{
    if (err) throw err;//console.log(res);
     rolelist = res.map((item) => ({ name: item.title, value: item.role_id }));
  });
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt([{
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Departments',
        'View Roles',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Role',
        'Quit'     
      ],
    }])
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          allSearch();
          break;

        case 'View Departments':
          departmentSearch();

          break;

        case 'View Roles':
          roleSearch();
          break;
        case 'Add Employee':
          addEmployee();
          break;
          
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
          case 'Update Role':
          updateRole();
          break;
        case 'Quit':
          process.exit(0);
          
    
       
      }
    });
};


const allSearch = async () => {
    
  const query = 'SELECT id, first_name, last_name, dep_name, title, salary FROM employee  INNER JOIN department ON employee.department_id = department.department_id  INNER JOIN roletype ON employee.role_id = roletype.role_id ORDER BY id';
  await connection.query(query, (err, res) => { 
    console.table(res);
    runSearch();
  });
};

const departmentSearch = async () => { console.log("function entered");
  const query =

    'SELECT * FROM department'
  await connection.query(query, (err, res) => {
   
    console.table(res);
       
    runSearch();
  });

}

const roleSearch = async () => { console.log("function entered");
  const query =
    'SELECT * FROM roleType'
  await connection.query(query, (err, res) => {
    //res.forEach(({ title, salary }) => {
      //console.log(
       // `Role: ${title}} || Salary: ${salary}`
      //);
    //});
    console.table(res);
    runSearch();
  });
}

const addEmployee = () => {
  connection.query("SELECT * FROM department", (err, res) =>{
    if (err) throw err;
       
     
  });

  inquirer
  .prompt([{
    name: 'first',
    type: 'input',
    message: 'Type in first name',
    
  },
  {
    name: 'last',
    type: 'input',
    message: 'Type in last name',
    
  },
  {
    name: 'role',
    type: 'list',
    message: 'Choose Role',
    choices: rolelist
    },
    {
      name: 'dep',
      type: 'list',
      message: 'Choose Department',
      choices: deplist /*[
        { 
          name: 'IT',
          value: 1 
        },
        { 
          name: 'Marketing',
          value: 2
        },
        {
          name: 'Accounting',
          value: 3
        },
      ]}*/
    }
  ])
  .then((answer4) => {
    
  const querySql = `INSERT INTO employee (first_name, last_name, role_id, department_id) VALUES ("${answer4.first}","${answer4.last}",${answer4.role}, ${answer4.dep} );`
  console.log(answer4)
  
   connection.query(querySql,
    /*{
      first_name: answer4.first,
    last_name: answer4.last,
     },*/
   
    (err, res) => {
    
      if (err) throw err;
      //console.log(`${res.affectedRows} department inserted!\n`);
      console.log("employee added");
      // Call updateProduct AFTER the INSERT completes
      runSearch();
    });
    });
  
 

}


const addDepartment =  () => {
  
  inquirer
  .prompt([{
    name: 'dep',
    type: 'input',
    message: 'Type in new Department',
    
  }])
  .then((answer2) => {
      
  const querySql = `INSERT INTO department (dep_name) VALUES ("${answer2.dep}");`
   connection.query(querySql, 
    
    (err, res) => {
    
      if (err) throw err;
      console.log("department added");
      runSearch();
    });
    });
  
     

}

const addRole =  () => {
   inquirer
  .prompt([{
    name: 'job',
    type: 'input',
    message: 'Type in new Role Title',
    
  },
  {
    name: 'wages',
    type: 'number',
    message: 'Type in new Role Salary',
    
  }])
  .then((answer3) => {
      
  const queryRole = 'INSERT INTO roletype SET ?';
   
   connection.query(queryRole,  
      {
       title: answer3.job,
       salary: answer3.wages,
      },
    (err) => {
    
      if (err) throw err;
      console.log("role added");
      runSearch();
    });
    });
  }
  
    
   const updateRole =  () => {
    inquirer
   .prompt([
   {
     name: 'name',
     type: 'input',
     message: 'Enter your first name',
     
   },
   {
    name: 'lastname',
    type: 'input',
    message: 'Enter your last name',
    
  },
   {
    name: 'role',
    type: 'list',
    message: 'Type in Updated Role',
    choices: rolelist
  }

  ])
   .then((answer3) => {
       console.log(answer3)
   const queryRole = `UPDATE employee SET role_id=${answer3.role} WHERE first_name="${answer3.name}" AND last_name="${answer3.lastname}";`
    
    connection.query(queryRole,  
      /*[ 
      {
        role_id : answer3.role,
      },
      { 
        first_name  : answer3.name,
      }
      
      ],*/
       (err) => {
     
       if (err) throw err;
       console.log("updated");
       
       runSearch();
     });
     });
   }
   
    
 

