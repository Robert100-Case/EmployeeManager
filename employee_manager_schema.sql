DROP DATABASE IF EXISTS employee_manager;
CREATE database employee_manager;

USE employee_manager;


CREATE TABLE roletype (
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(8,2) NULL,
  PRIMARY KEY (role_id)
);

CREATE TABLE department (
department_id INT NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR(30) NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT,
  department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roletype (role_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);


INSERT INTO roletype (title, salary)
VALUES ("VP", 200000.00);
INSERT INTO	roletype (title, salary)
VALUES ("Developer", 100000.00);
INSERT INTO roletype (title, salary)
VALUES ("Salesman", 50000.00);	

INSERT INTO department (dep_name)
VALUES ("IT"), ("Marketing"), ("Accounting");

INSERT INTO employee (first_name, last_name, role_id, department_id)
VALUES ("Joe", "Thomas", 1, 1), ("Robert", "Rossman", 2, 2), ("Bill", "Davis", 3, 3);

-- SELECT id, first_name, last_name, dep_name, title, salary FROM employee 
-- INNER JOIN department ON employee.department_id = department.department_id
-- INNER JOIN roletype ON employee.department_id = roletype.role_id;

