const mysql = require('mysql');
const util = require("util")
const inquirer = require('inquirer');
const { SlowBuffer } = require('buffer');
const cTable = require('console.table');  

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
    
  const query = 'SELECT id, first_name, last_name, dep_name, title, salary FROM employee  INNER JOIN department ON employee.department_id = department.department_id  INNER JOIN roletype ON employee.role_id = roletype.role_id';
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
    /*res.forEach(({ title, salary }) => {
      console.log(
        `Role: ${title}} || Salary: ${salary}`
      );
    });*/
    console.table(res);
    runSearch();
  });
}

const addEmployee = () => {
  //connection.query("SELECT dep_name FROM department", (err, res) =>{
    //if (err) throw err;});console.log('connection made');console.table(res);
  
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
    type: 'rawlist',
    message: 'Choose Role',
    choices: [
      { 
        name: 'Developer',
        value: 1 
      },
      { 
        name: 'Salesman',
        value: 2
      },
      {
        name: 'VP',
        value: 3
      },
    ]},
    {
      name: 'dep',
      type: 'rawlist',
      message: 'Choose Department',
      choices: [
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
      ]}
  ])
  .then((answer4) => {
    
  const querySql = `INSERT INTO employee (first_name, last_name) VALUES ("${answer4.first}","${answer4.last}");`
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
  console.log(err);
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
      //console.log(`${res.affectedRows} department inserted!\n`);
      console.log("department added");
      // Call updateProduct AFTER the INSERT completes
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
      //console.log(`${res.affectedRows} department inserted!\n`);
      console.log("role added");
      // Call updateProduct AFTER the INSERT completes
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
    name: 'role',
    type: 'rawlist',
    message: 'Type in Updated Role',
    choices://['VP', 'Developer', 'Salesman'] 
     [
      { 
        name: 'VP',
        value: 1 
      },
      { 
        name: 'Developer',
        value: 2
      },
      {
        name: 'Salesman',
        value: 3
      },
    ]

  },])
   .then((answer3) => {
       console.log(answer3)
   const queryRole = `UPDATE employee SET role_id=${answer3.role} WHERE first_name="${answer3.name}";`
    
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
       //console.log(`${res.affectedRows} department inserted!\n`);
       console.log("updated");
       
       runSearch();
     });
     });
   }
   
    
 

