import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../../constant/app.constant';
import {CartDetailService } from '../../../provider/cartdetail';
import {PaymentInfoService } from '../../../provider/paymentInfo';
import {OrderService } from '../../../provider/order';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
import {Meta,Title} from '@angular/platform-browser';
import { GlobalData } from '../../../provider/app.global';

declare var bootbox:any;
declare var $:any;
@Component({
    selector:'order-info',
    templateUrl:'./order-info.html'
})

export class orderInfo implements OnChanges{
    @Input('currentLanguageData') currentLanguageData:any;
    //@Input('isFirst') isFirst:any;
  ///  @Input('paymen_type') paymen_type:any;
    @Input('getcartData') getcartData:any={};
   // @Input('continueButtonStatus') continueButtonStatus:any;
    //@Input('isAddressAvailable') isAddressAvailable:any;
    
   // @Output('needToloadCartDetails')needToloadCartDetails = new EventEmitter();
    user:any={};
    userExist:boolean=false;
    baseUrl:string = appConstant['baseUrl'];
    storeData:any={};
    cartdata:any=new Array();
   // productAvailabilityArr:any=new Array();
    errormsg_not_available:boolean=false; 
    cartlength:any;
    imagepath:any;
    errormsg:any;
    emptyCart:boolean=false;
     grandTotal:any;
    couponTransactionId:any;
    
    paymentType:string='';
    palceOrderData:any = {};
    isPayPalForm:boolean = true;
    PAYPAL = 'PAYPAL';
   // productQuantity:number = 1;
    coupon:any={};
    constructor(private globalDataService:GlobalData,private paymentinfoservice : PaymentInfoService,private meta:Meta,private cartdetailservice:CartDetailService,private orderservice:OrderService,private currencyconvertservice:CurrencyConvertService,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
        this.router=router;
        if(localStorage.getItem('userLoginDetail'))
        {
			    this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
			    this.userExist=true;
		    }

    }

	ngOnChanges(change:{currentLanguageData:SimpleChange,getcartData:SimpleChange}){
     if(Object.keys(this.getcartData).length>0){
      this.cartdata = this.getcartData;
      this.imagepath = this.cartdata.thumb_path;
      //alert("inside order Info"+Object.keys(this.getcartData).length);
     // alert("cart data"+this.cartdata.cart_data.length);
     
    } 
   
    }
  

  //Function to show alert popup to Delete****************************
removeProduct(cartID){
  this.deleteItem(cartID);
}
   //Function to delete product from cart******************************
   deleteItem(cartID){
    let URL =  this.baseUrl+'front/basket/remove_cart';
      let data;
      if(this.userExist){
        data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],cart_id:cartID,user_id:this.user.id};
      }
      else{
        data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],cart_id:cartID};
      }
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
         }
      });
   
    
  }
 
 //Function to show order Details*************************************
  showItems(event){
    //console.log(event.currentTarget);
    	$('.checkout-sub-total .items-dtails .chkout-items').slideToggle();
			$(event.currentTarget).toggleClass('rotate');
  }

   // show login form **************************************************
   showLoginPopUp(){
    $("#login").show("slow");
   // if(this.applyCouponCodeFlag)
    //this.cartdetailservice.URLtogo = '/cart';
   // else
    //this.cartdetailservice.URLtogo = '/shipping-detail';
   // alert(this.cartdetailservice.URLtogo);
   }
  
  

  //FUnction to place order ************************************

  placeOrder(){
   // alert(this.paymentType);
    let billaddress_id = '';
   if(this.paymentType==undefined)
     alert('Please select any option for payment!');
    //this.globaldata.showToaster({type:'error',body:'Please select any option for payment!'});
    else if(localStorage.getItem('isAddresschecked')==null){
    alert('Please select Address!');
   }
    else{
     // if(localStorage.getItem('isBillingAddresschecked')!=null){
       // billaddress_id = localStorage.getItem('isBillingAddresschecked');
     // }
      let URL = this.baseUrl+'front/order/place_order';
      if(localStorage.getItem('isAddresschecked')!=null){
          let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],
                      "user_id":this.user.id,"address_id":localStorage.getItem('isAddresschecked'),
                      "payment_type":this.paymentType,"grand_total":this.grandTotal};
          this.httpService.createPostRequest(URL,data).subscribe(response=>{
          if(response.status){
            this.palceOrderData = response['data']; 
           if(this.paymentType != this.PAYPAL){
            //this.needToloadCartDetails.emit({'data':'','status':'true'});
                alert('Thanks For Order');
                this.router.navigate(['order-confirmation']);
             }
              else{
                this.isPayPalForm = true;
                setTimeout(()=>{
                 $("#paypalBtn").trigger("click");
                },300);
              }

          }
          });
      }
      //alert("Address Not Selected");
      
    }
  }
}
