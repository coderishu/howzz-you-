import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundOf implements PipeTransform {
  
      transform (input:number) {
        return Math.round(input);
      }
}