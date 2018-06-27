import {Component,Directive,Input} from '@angular/core';
declare var $:any;
@Component({selector: 'loader',
            styleUrls:['./loader-component.css'], template: `<div class="overlay" *ngIf = "isLoader">
	<div class="loader"></div>
</div>`})
export class Loader 
{
    @Input('isLoader') isLoader:boolean;
    constructor(){
    }
    // isLoader:boolean = false;
    showLoader():void{
        this.isLoader = true;
//alert(this.isLoader)
        $(".overlay.loader").addClass("active");
    }
    hideLoader():void{
       this.isLoader = false; 
       $(".overlay.loader").removeClass("active");
    }
   getStatus():boolean{
       return this.isLoader;
   }
}