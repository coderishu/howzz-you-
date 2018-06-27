import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,Input,Output,EventEmitter,SimpleChange
} from '@angular/core';

import { NgForm } from '@angular/forms';
import {StripeCheckoutLoader, StripeCheckoutHandler} from 'ng-stripe-checkout';
declare var Stripe:any;
declare var $:any;


@Component({selector:'stripe-payment',templateUrl:'stripe.component.html' })
export class StripeComponent implements AfterViewInit, OnDestroy {
 
  private stripeCheckoutHandler: StripeCheckoutHandler;
  @Input('paymentData') paymentData:Object = {};
  @Input('paymentMethod') paymentMethod:Object = {};
  @Output('getStripeToken') getStripeToken = new EventEmitter<any>();
  stripe:any;
  elements:any;
  style:any  = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};
card:any;
form:any;
  

  constructor(private stripeCheckoutLoader: StripeCheckoutLoader) {
     

   }
 ngOnChanges(change:{[paymentMethod:string]:SimpleChange}){
   //console.log("paymentMethod=="+JSON.stringify(this.paymentMethod));

 }
  ngAfterViewInit() {
    console.log(this.paymentMethod['payment']['secret_key'])
      //pk_test_IV1wPaIMwFHBXiH5tP4GME0z
      this.stripe = Stripe(this.paymentMethod['payment']['secret_key']);
     this.elements = this.stripe.elements();
     this.card = this.elements.create('card', {style: this.style});
     this.card.mount('#card-element');
     // Handle real-time validation errors from the card Element.
this.card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
    // Handle form submission.
this.form = document.getElementById('payment-form');
this.form.addEventListener('submit', (event)=> {
  event.preventDefault();

  this.stripe.createToken(this.card).then((result)=> {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
        this.getStripeToken.emit(result);
      // Send the token to your server.
     // stripeTokenHandler(result.token);
    }
  });
});
     
 
  }
  
      
  

  ngOnDestroy() {
   
 
  }


}