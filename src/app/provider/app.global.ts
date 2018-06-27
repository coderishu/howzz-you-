import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {Component,OnInit,Injectable, ViewChild,PLATFORM_ID,Inject } from '@angular/core';
import { isPlatformBrowser,isPlatformServer} from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


declare var $: any;

@Injectable()
export class GlobalData {
    
    priceCodeData:string;
    maxRating:number = 5;
    ratioOfRating:number = 20;
    isBrowser:boolean = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if(isPlatformBrowser(this.platformId)) {
     this.isBrowser = true;
       }
    }
    addToWishListInLocalStorage(wishList)
    {
        localStorage.setItem("userWishList",JSON.stringify(wishList));
    }
    lazyLoad(){
          
     let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let clientHeight =  document.documentElement.clientHeight || document.body.clientHeight;
     if(this.isBrowser){
        $("img.loading").each(function(){
     let element = this;
      let offsetTopElement = $(element).offset().top;
      
      if(scrollTop > offsetTopElement-clientHeight){
        
            $(element).attr("src",$(element).data("src"));
            $(element).addClass("loaded");
            $(element).removeClass("loading");
        
      }
      
    });
     }
    
       
}
openPopUp(popInstance){
popInstance.style.display = "block";
document.querySelector("body").style.overflow = "hidden"; 
}
closePopup(popInstance){
    popInstance.style.display = "none";
document.querySelector("body").style.overflow = "auto"; 
}
       
}





