import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Injectable, ViewChild } from '@angular/core';

declare var $: any;

@Injectable()
export class CommonService {
    
    
    constructor() {

    }
       createRating(max,rating){

  //console.log("ratingCount=="+rating)
    let fractionVal:any = (rating%parseInt(rating.toString()))
    let ratingMax = [];
    let item:string;
   // console.log("parseInt(this.ratingCount.toString())=="+parseInt(this.ratingCount.toString()))
if(max > 0){
  for(let i = 0;i<max;i++) {
      if(parseInt(rating.toString()) > i)
      item = 'fa-star'
      else if(parseInt(rating.toString()) == i && fractionVal > .4)
      item = 'half-star';
      else
      item = 'blank';

   ratingMax.push(item);
  
}
return ratingMax;
//console.log("ratingCount=="+this.ratingMax) 

}



}
}





