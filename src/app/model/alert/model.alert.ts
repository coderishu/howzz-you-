import {Component,ElementRef} from '@angular/core';
declare var $:any;

@Component({selector: 'model-alert', 
template: `<div   class = "overlay model-alert"><div  class = "model-popup-block">
<a (click) = "closePopup()" class = "close-cross" href = "javascript:void(0)"><i class="fa fa-times" aria-hidden="true"></i></a>
<div class = "popup-header popup-field"> <h2 class = "head">{{'popUp.alert.message' | translate}} </h2> </div>
<div class = "popup-message popup-field popup-message"> <span>{{message}} </span> </div>
<div class = "model-close popup-field"> <a (click) = "closePopup()" class = "pop-close-btn" href = 'javascript:;'>{{'popUp.alert.close' | translate}} </a> </div>
</div>
</div>`,
styleUrls:['./model.alert.css']})
export class ModelAlertPopup{
    isModelOpen:boolean = false;
    constructor(){
    
    }
    message:string;
    openPopup(message:string){
        this.message = message;
        $(".overlay.model-alert").css("display","block");
        $(".popup-message").text(message);
        this.isModelOpen = true;
 
        
       
    }
    closePopup(){
        $(".overlay.model-alert").css("display","none");
   this.isModelOpen = false;
    }
}