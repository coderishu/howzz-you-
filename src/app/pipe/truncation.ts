import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class TruncatePipe {
  transform(value: any, args: any) : any {
    
    let limit = args;
    let dataArr = new Array();
    dataArr = value;
    return dataArr.length > limit ? dataArr.slice(0,limit) : dataArr ;

  }
}