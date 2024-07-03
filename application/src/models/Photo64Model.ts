export interface Photo64Model {
  photo64: string
  apartmentId?: string
  id?: string
}

export const photo64ModelFromUrl = (url: string): Photo64Model => {
  return {
    photo64: url
  };
};
