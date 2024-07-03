export interface RoomPhotoModel {
  id?: string
  photoBase64: string
  roomId?: string
}

export const roomPhotoModelFromUrl = (url: string): RoomPhotoModel => {
  return {
    photoBase64: url
  };
};
