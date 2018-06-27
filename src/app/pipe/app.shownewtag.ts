import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'shownewtag'
})
export class ShowNewTagPipe implements PipeTransform {
 
transform (fdate:any,tdate:any) {
  //console.log("fdate=="+fdate);
 // console.log("tdate=="+tdate);
        let f_date_time = new Date(fdate).getTime();
        let to_date_time = new Date(tdate).getTime();
        let c_date_time = new Date().getTime();
        if(f_date_time <= c_date_time && to_date_time >= c_date_time)
          return true;
       else
          return false;
        
      
      }
     
}