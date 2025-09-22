import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(
    value: string | null | undefined, 
    limit: number = 50, 
    trail: string = '...',
    completeWords: boolean = false
  ): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;
    
    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    
    return value.substring(0, limit) + trail;
  }
}