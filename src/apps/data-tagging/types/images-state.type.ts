import { TImage } from './image.type';

export type TImagesState = {
  isLoading: boolean;
  data: TImage[];
  error: Error;
};
