import { TMarker } from './marker.tpe';

export type TImage = {
  id: number;
  src: string;
  markers?: TMarker[];
  isLoading?: boolean;
  isSubmitting?: boolean;
};
