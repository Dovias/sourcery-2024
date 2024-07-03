ALTER TABLE stays
ADD COLUMN apartment_id UUID;

ALTER TABLE stays
ADD CONSTRAINT stays_apartment_id_fkey
FOREIGN KEY(apartment_id) REFERENCES apartments(id)
ON DELETE CASCADE;