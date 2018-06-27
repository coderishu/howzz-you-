import {Component,PipeTransform,Pipe} from '@angular/core';

@Pipe({name:"recentFilter"})

export class RecentFilter implements PipeTransform{
    transform(data:any,value:string):any{
        //alert('filter'+value);
    if(value=='low_to_high')
    {
            return data.sort((a,b)=>{
               return  a['product_data']['special_price'] - b['product_data']['special_price']
               });
    }
    if(value=='high_to_low')
    {
            return data.sort((a,b)=>{
               return  b['product_data']['special_price'] - a['product_data']['special_price']
               });
    }

    if(value == 'newest')
    {
        return data.sort((a,b)=>{
           new Date(b.new_from_date).getTime()  - new Date(a.new_to_date
           ).getTime()
           
           });
           }
}

    }