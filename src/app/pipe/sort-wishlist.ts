import {Component,PipeTransform,Pipe} from '@angular/core';
@Pipe({name:"sortWishList"})
export class Sorting implements PipeTransform{
    //test:Array<any> = [];
    transform(data:any,type:string):any{
       return data.filter(function (product) {
       // return object[key] === type;
       if(type != ''){
           
        return product.product_id.name.name.toLowerCase().indexOf(type) > -1;
        //else if()
       }
       
       else return product
       //console.log(JSON.stringify(object))
      // return object;
    });
    }
  
 
    
    
}