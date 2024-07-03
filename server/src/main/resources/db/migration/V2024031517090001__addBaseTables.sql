CREATE TABLE apartments (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL
);
CREATE TABLE apartment_photos (
    id UUID PRIMARY KEY,
    apartment_id UUID NOT NULL,
    photo_base64 TEXT,
    CONSTRAINT apartment_photos_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    apartment_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    CONSTRAINT rooms_apartment_id_fkey FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);
CREATE TABLE employees (
    id UUID PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(50) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    profile_base64 TEXT
);
CREATE TABLE stays (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    note TEXT,
    CONSTRAINT stays_room_id_fkey FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT stays_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES employees(id)
);
