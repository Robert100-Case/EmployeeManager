const mysql = require('mysql');
const util = require("util")
const inquirer = require('inquirer');
const { SlowBuffer } = require('buffer');

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
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View Departments',
        'View Roles',
        'Add Department'     
      ],
    })
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

        case 'Add Department':
          addDepartment();
          break;

       
      }
    });
};

const allSearch = async () => {
    
  const query = 'SELECT id, first_name, last_name, dep_name, title, salary FROM employee  INNER JOIN department ON employee.department_id = department.department_id  INNER JOIN roletype ON employee.department_id = roletype.role_id';
  await connection.query(query, (err, res) => { 
    res.forEach(({ first_name, last_name, dep_name, title, salary }) => {
      console.log(
        `First Name: ${first_name} || Last Name: ${last_name} || Department: ${dep_name} || Title: ${title} Salary: ${salary}`
      );
    }) 
    runSearch();
  });
};

const departmentSearch = async () => { console.log("function entered");
  const query =
    'SELECT * FROM department'
  await connection.query(query, (err, res) => {
    res.forEach(({ dep_name }) => {
      console.log(
        `Department: ${dep_name}`
      );
    });

    runSearch();
  });
}

const roleSearch = async () => { console.log("function entered");
  const query =
    'SELECT * FROM roleType'
  await connection.query(query, (err, res) => {
    res.forEach(({ title, salary }) => {
      console.log(
        `Role: ${title}} || Salary: ${salary}`
      );
    });

    runSearch();
  });
}

const addDepartment =  () => {
  inquirer
  .prompt({
    name: 'dep',
    type: 'input',
    message: 'Type in new Department',
    
  })
  .then((answer2) => {
      
  const query = 'INSERT INTO department (dep_name) VALUES (@test)'
  
   connection.query(query,{test: answer2.dep }, (err, res) => {
    {
      if (err) throw err;
      //console.log(`${res.affectedRows} department inserted!\n`);
      console.log("department added");
      // Call updateProduct AFTER the INSERT completes
      runSearch();
    }
    });
  });
   //    runSearch();   

}

/*const viewDepartment = async () => {

  const query2 = 'SELECT * FROM department';
   console.log("in view function");  
    
  await connection.query(query2, (err, res) => {
    console.log("awaiting query result");  
    
    res.forEach(({ dep_name}) => {
      console.log("printing names of departments");  
    
      console.log(
        `Department ${dep_name}`
        );
     
      });
      runSearch();
    });
    }*/
  

/*const createProduct = () => {
  console.log('Inserting a new product...\n');
  const query = connection.query(
    'INSERT INTO products SET ?',
    {
      flavor: 'Rocky Road',
      price: 3.0,
      quantity: 50,
    },
    (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} product inserted!\n`);
      // Call updateProduct AFTER the INSERT completes
      updateProduct();
    }
  );
  }

  
  



const artistSearch = () => {
  inquirer
    .prompt({
      name: 'artist',
      type: 'input',
      message: 'What artist would you like to search for?',
    })
    .then((answer) => {
      const query = 'SELECT position, song, year FROM top5000 WHERE ?';
      connection.query(query, { artist: answer.artist }, (err, res) => {
        res.forEach(({ position, song, year }) => {
          console.log(
            `Position: ${position} || Song: ${song} || Year: ${year}`
          );
        });
        runSearch();
      });
    });
};


const rangeSearch = () => {
  inquirer
    .prompt([
      {
        name: 'start',
        type: 'input',
        message: 'Enter starting position: ',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: 'end',
        type: 'input',
        message: 'Enter ending position: ',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answer) => {
      const query =
        'SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?';
      connection.query(query, [answer.start, answer.end], (err, res) => {
        res.forEach(({ position, song, artist, year }) => {
          console.log(
            `Position: ${position} || Song: ${song} || Artist: ${artist} || Year: ${year}`
          );
        });
        runSearch();
      });
    });
};

const songSearch = () => {
  inquirer
    .prompt({
      name: 'song',
      type: 'input',
      message: 'What song would you like to look for?',
    })
    .then((answer) => {
      console.log(answer.song);
      connection.query(
        'SELECT * FROM top5000 WHERE ?',
        { song: answer.song },
        (err, res) => {
          if (res[0]) {
            console.log(
              `Position: ${res[0].position} || Song: ${res[0].song} || Artist: ${res[0].artist} || Year: ${res[0].year}`
            );
          } else {
            console.error(`No results for ${answer.song}`);
          }
          runSearch();
        }
      );
    });
};

const songAndAlbumSearch = () => {
  inquirer
    .prompt({
      name: 'artist',
      type: 'input',
      message: 'What artist would you like to search for?',
    })
    .then((answer) => {
      let query =
        'SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ';
      query +=
        'FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ';
      query +=
        '= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position';

      connection.query(query, [answer.artist, answer.artist], (err, res) => {
        console.log(`${res.length} matches found!`);
        res.forEach(({ year, position, artist, song, album }, i) => {
          const num = i + 1;
          console.log(
            `${num} Year: ${year} Position: ${position} || Artist: ${artist} || Song: ${song} || Album: ${album}`
          );
        });

        runSearch();
      });
    });
  };
  */