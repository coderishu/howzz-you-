import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fixedDecimal'
})
export class FixedDecimalPipe implements PipeTransform {
  currencyJSON:any={};
  convertJSON:any;
  basecurrencycodeval:any;
  
    
       
       transform (input:number) {
        // console.log("Input"+input);
         return input.toFixed(2)+"/-";
        //return Math.round(input);
      }
}