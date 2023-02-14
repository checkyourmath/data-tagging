import { Injectable } from '@angular/core';
import { IImagesService } from '../interfaces/images-service.interface';
import { TImage } from '../types/image.type';
import { from, Observable, Subject } from 'rxjs';

const MOCK_IMAGES_SOURCES = [
  '/apps/data-tagging/assets/img/images/1.jpg',
  '/apps/data-tagging/assets/img/images/2.jpg',
  '/apps/data-tagging/assets/img/images/3.jpg',
  '/apps/data-tagging/assets/img/images/4.jpg',
  '/apps/data-tagging/assets/img/images/5.jpg',
  '/apps/data-tagging/assets/img/images/6.webp',
];
const RESPONSE_DELAY = 200;

@Injectable({ providedIn: 'root' })
export class ImagesMockService implements IImagesService {

  private nextMockImageSrcIndex = 0;
  private nextImageId = 1;

  public loadNextImages(numberOfImages: number): Observable<TImage[]> {
    const promise = new Promise<TImage[]>((resolve) => setTimeout(() => {
      const images: TImage[] = [];

      for (let i = 0; i < numberOfImages; i++) {
        images.push({
          id: this.getNextImageId(),
          src: this.getNextImageSrc(),
        });
      }

      resolve(images);
    }, RESPONSE_DELAY));

    return from(promise);
  }

  public submitImage(image: TImage): Observable<void> {
    const promise = new Promise<void>((resolve) => setTimeout(() => {
      resolve();
    }, RESPONSE_DELAY));

    return from(promise);
  }

  private getNextImageId(): number {
    return this.nextImageId++;
  }

  private getNextImageSrc(): string {
    const src = MOCK_IMAGES_SOURCES[this.nextMockImageSrcIndex];

    this.nextMockImageSrcIndex++;

    if (this.nextMockImageSrcIndex > MOCK_IMAGES_SOURCES.length - 1) {
      this.nextMockImageSrcIndex = 0;
    }

    return src;
  }


}
