import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertEstimateDate'
})
export class ConvertEstimateDatePipe implements PipeTransform {
 
/*transform (date:any,deliveryDay:any) {
        console.log("Input"+date);
        console.log("Input"+deliveryDay);
         return date;
      
      }*/
      transform(date:Date,deliveryDay:number):string{
        //  alert(deliveryDay);
        let dateOb = new Date(date);
        
        //console.log('Input'+dateOb);
        let newdate = new Date(dateOb.setDate(dateOb.getDate() + deliveryDay));
        let year = newdate.getFullYear();
        let month = newdate.getMonth()+1;
        return newdate.getDate()+','+this.getMonth(month)+','+year;
       

    }
   
    getMonth(month){
        let currentMonth = ''
        switch(month){
            case 1 :
            currentMonth = 'Jan';
            break;
            case 2 :
            currentMonth = 'Feb';
            break;
            case 3 :
            currentMonth = 'Mar';
            break;
            case 4 :
            currentMonth = 'Apr';
            break;
            case 5 :
            currentMonth = 'May';
            break;
            case 6 :
            currentMonth = 'Jun';
            break;
            case 7 :
            currentMonth = 'Jul';
            break;
            case 8 :
            currentMonth = 'Aug';
            break;
            case 9 :
            currentMonth = 'Sep';
            break;
            case 10 :
            currentMonth = 'Oct';
            break;
            case 11 :
            currentMonth = 'Nov';
            break;
            case 12 :
            currentMonth = 'Dec';
            break;

        }
        return currentMonth;
    }
}