CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (role_id, role_name)
VALUES (1, 'USER'), (2, 'EDITOR'), (3, 'ADMIN');

ALTER TABLE employees
ADD COLUMN role_id INT;

UPDATE employees SET role_id = (
    SELECT role_id FROM roles WHERE role_name = employees.role
);

ALTER TABLE employees
ADD CONSTRAINT fk_role
FOREIGN KEY (role_id) REFERENCES roles(role_id)
ON DELETE CASCADE;

ALTER TABLE employees
DROP COLUMN role;

ALTER TABLE employees
ALTER COLUMN role_id SET NOT NULL;