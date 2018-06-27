import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef,EventEmitter,Renderer} from '@angular/core';
import {Router} from '@angular/router';
import {appConstant} from '../../../../constant/app.constant';

import {DomSanitizer  } from '@angular/platform-browser';

declare var $:any;

//  import {DataService} from '../../services/http-service';


@Component({
   
    selector:'paypal-form',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    templateUrl:`./paypal.component.html`
})
export class PaypalForm implements OnChanges{
       @Input('cartData') cartData:Object = {};
       @Input('palceOrderData') palceOrderData:Object = {};
      // @Input('defaultCurrency') defaultCurrency:Object;
       @Input('currencyConvertService') currencyConvertService:Object = {};
       @Input('paymentMethod') paymentMethod:Array<any>=[];
       origin:any = window.location.origin;
       notifyUrl:string = appConstant['paypal']['notifyUrl'];
      // notifyUrl:string = "http://demo.thesparxitsolutions.com/js-demo/pay.php";
       orderConfirmation:string = this.origin+'/order-confirmation';
      // orderConfirmation:string = 'http://10.0.4.21:3000/order-confirmation';
        cancelOrderUrl:string = this.origin+'/order-cancel'; 
     // cancelOrderUrl:string = 'http://10.0.4.21:3000/order-cancel'; 
       sandboxAccount:string = 'munfedkhan.khan786@gmail.com';
       developerAccount:string = 'sparxapp1@gmail.com';
      
      constructor()
      {
         //  console.log("orderConfirmation=="+this.orderConfirmation)
}


ngAfterViewInit() 
{
 // this.developerAccount = this.paymentMethod['payment']['email'];
  if(this.paymentMethod)
  {
    this.developerAccount = this.paymentMethod['payment']['email'];
  }
		
	}
	
ngOnChanges(change:{[productDetail:string]:SimpleChange} )
{
      
}



   
    ngOnInit() 
    {
      
  }

 
}