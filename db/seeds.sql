INSERT INTO department (name)
VALUES
("Operations"),
("Transportation");


INSERT INTO role (title, salary, department_id)
VALUES
("Plumber", 55000.00, 1 ),
("Electrician", 60000.00, 1 ),
("Carpender", 50000.00, 1),
("Bus Driver", 25000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Smith", 1, 1),
("Jane", "Smith", 2, 1),
("Billy", "Jean", 3, 1),
("Roy", "Ocean", 4, 2),
("Sandra", "Allen", 4, 2);
