import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
 
})
export class FilterSearchPipe implements PipeTransform {
  filterkey:string;
  
  transform(items: any, field: any): any {
    if(field)
    {
      return items.filter((data)=>{
          return data.attval.toLowerCase().startsWith(field);
      })
    }
    else return items;
 
}

}