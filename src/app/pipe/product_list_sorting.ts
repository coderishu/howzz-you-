import {Component,PipeTransform,Pipe} from '@angular/core';

@Pipe({name:"productlistsort"})

export class SortProductList implements PipeTransform{
    transform(data:any,value:string):any
    {
     
    if(value=='low_to_high')
    {
            return data.sort((a,b)=>{ 
               return  a['price'] - b['price']
               });
    }
    else if(value=='high_to_low')
    {
            return data.sort((a,b)=>{
               return  b['price'] - a['price']
               });
    }

   else if(value == 'newest')
    {
        return data.sort((a,b)=>{
          return (new Date(b['product_data']['new_from_date']).getTime()  - new Date(a['product_data']['new_from_date']).getTime());
           });
     }
          else if(value =='A-Z')
           {
             return data.sort((a,b)=>{
               // if(a['name']['name'] < b['name']['name']) return -1;
             return a['name']['name'] > b['name']['name'];
               // return 0;
                // return a['name']['name'].toLowerCase()-b['name']['name'].toLowerCase();

           });
           }
          else if(value =='Z-A')
           {
             return data.sort((a,b)=>{
                return b['name']['name'] > a['name']['name'];
           });
           }

           else
           {
               return data;
           }
}

    }