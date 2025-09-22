import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    value: number | string | null | undefined,
    currencyCode: string = 'USD',
    display: 'symbol' | 'code' | 'symbol-narrow' | string = 'symbol',
    digitsInfo: string = '1.2-2',
    locale: string = 'en-US'
  ): string | null {
    // Handle null, undefined, or empty values
    if (value == null || value === '') {
      return null;
    }

    // Convert string input to number
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Handle invalid numbers
    if (isNaN(numericValue)) {
      console.warn('PricePipe: invalid number', value);
      return null;
    }

    // Format the currency
    return this.currencyPipe.transform(
      numericValue,
      currencyCode,
      display,
      digitsInfo,
      locale
    );
  }
}