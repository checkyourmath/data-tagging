import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TImage } from '../types/image.type';

export const IMAGES_SERVICE = new InjectionToken<IImagesService>(
  'PRODUCTS_SERVICE'
);

export interface IImagesService {
  loadNextImages(numberOfImages: number): Observable<TImage[]>;
  submitImage(image: TImage): Observable<void>;

}
