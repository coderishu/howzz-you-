import {Component,PipeTransform,Pipe} from '@angular/core';
@Pipe({name:"sortFilter"})
export class SortingFilter implements PipeTransform{
    //test:Array<any> = [];
    transform(data:any,type:string):any{
   //console.log("data= "+JSON.stringify(data));
    //console.log("type= "+type);
    if(type == 'asce'){
 return data.sort((a,b)=>{
    return  a['summary_rating'] - b['summary_rating']
    });
}
else 
if(type == 'desc'){
 return data.sort((a,b)=>{
    return  b['summary_rating'] - a['summary_rating']
    });
}
else 
if(type == 'recent'){
    return data.sort((a,b)=>{
       return  b['like'] - a['like']
       //new Date(b.createdAt).getTime()  - new Date(a.createdAt).getTime()
       });
       }

    }
  
 
    
    
}