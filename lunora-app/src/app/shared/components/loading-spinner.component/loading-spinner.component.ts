import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  /**
   * Size of the spinner (in pixels)
   * @default 2rem
   */
  @Input() size: string = '2rem';

  /**
   * Color of the spinner
   * @default 'currentColor' (inherits parent color)
   */
  @Input() color: string = 'currentColor';

  /**
   * Thickness of the spinner border
   * @default '0.25em'
   */
  @Input() thickness: string = '0.25em';

  /**
   * Whether to show the spinner in a centered container
   * @default false
   */
  @Input() centered: boolean = false;

  /**
   * Additional CSS classes to apply
   */
  @Input() additionalClasses: string = '';

  /**
   * Accessibility label for the spinner
   * @default 'Loading...'
   */
  @Input() ariaLabel: string = 'Loading...';
}