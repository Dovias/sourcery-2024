ALTER TABLE apartment_photos
DROP CONSTRAINT apartment_photos_apartment_id_fkey;

ALTER TABLE apartment_photos
ADD CONSTRAINT apartment_photos_apartment_id_fkey
FOREIGN KEY(apartment_id) REFERENCES apartments(id)
ON DELETE CASCADE;

ALTER TABLE rooms
DROP CONSTRAINT rooms_apartment_id_fkey;

ALTER TABLE rooms
ADD CONSTRAINT rooms_apartment_id_fkey
FOREIGN KEY(apartment_id) REFERENCES apartments(id)
ON DELETE CASCADE;

ALTER TABLE stays
DROP CONSTRAINT stays_employee_id_fkey;

ALTER TABLE stays
DROP CONSTRAINT stays_room_id_fkey;

ALTER TABLE stays
ADD CONSTRAINT stays_employee_id_fkey
FOREIGN KEY(employee_id) REFERENCES employees(id)
ON DELETE CASCADE;

ALTER TABLE stays
ADD CONSTRAINT stays_room_id_fkey
FOREIGN KEY(room_id) REFERENCES rooms(id)
ON DELETE CASCADE;
