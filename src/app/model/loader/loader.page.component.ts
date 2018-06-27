import {Component,Directive} from '@angular/core';

@Component({selector: 'loader',
            styleUrls:['./loader-component.css'], template: `<div class="overlay" *ngIf = "isLoader">
	<div class="loader"></div>
</div>`})
export class Loader {
    constructor(){
       
    }
    isLoader:boolean = false;
    showLoader():void{
        this.isLoader = true;
    }
    hideLoader():void{
       this.isLoader = false; 
    }
   getStatus():boolean{
       return this.isLoader;
   }
}