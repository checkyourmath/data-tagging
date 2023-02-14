import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, Input,
  Output
} from '@angular/core';

@Component({
  selector: 'dt-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements AfterViewInit {

  @Input() public overlay: boolean;
  @Output() public visible = new EventEmitter<void>();

  private observer: IntersectionObserver;

  constructor(
    private element: ElementRef
  ) {
  }

  public ngAfterViewInit(): void {
    this.createObserver();
  }

  private createObserver(): void {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          this.visible.emit();
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.01,
    });

    this.observer.observe(this.element.nativeElement);
  }
}
