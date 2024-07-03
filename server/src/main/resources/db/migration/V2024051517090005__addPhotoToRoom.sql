CREATE TABLE room_photos (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    photo_base64 text NOT NULL,
    CONSTRAINT room_photos_room_id_fkey FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE
);