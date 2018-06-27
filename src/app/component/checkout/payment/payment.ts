import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
import {CartDetailService } from '../../../provider/cartdetail';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import { FlashMessagesService } from 'ngx-flash-messages';
import { GlobalData } from '../../../provider/app.global';
declare var $:any;
@Component({
    selector:'payment',
    templateUrl:'./payment.html',
   // styleUrls:['./payment.css']
})

export class Payment implements OnChanges{
  @Input('currentLanguageData') currentLanguageData:any;
  @Input('grandTotal') grandTotal:any;
  @Input('continueButtonStatus') continueButtonStatus:any;
  @Input('getcartData') cartdata : any;
  @Output('needToloadCartDetails') needToloadCartDetails = new EventEmitter();
    baseUrl:string = appConstant['baseUrl'];
    user:any={};
    userExist:boolean=false;
    typeOfCart =  localStorage.getItem("isGift")?localStorage.getItem("isGift"):undefined;
    paymentMethod:Array<any>=[];
    isPaymentData:boolean = false;
    paymentType:string='COD';
    giftShowing:boolean=false;
    showHide:boolean;
    isGiftVoucher:boolean = false;
    isApplyAmountSubmit:boolean = false;
    applyAmount:number;
    isFormSubmit:boolean = false;
    cardamount:any;
    couponCredentionalData:any={};
    isGiftVoucherAmount:boolean = false;
    coupon:any={};
    cardid:any;
    palceOrderData:any = {};
    isPayPalForm:boolean = true;
    PAYPAL = 'PAYPAL';
    stripePaymentToken:string = '';
    cartDetailData:any;
    isLoader:boolean = false;
    paymentMethodData : Object = {};
    constructor(private globalDataService:GlobalData,private flashMessagesService:FlashMessagesService,private currencyconvertservice:CurrencyConvertService,private cartDetailservice:CartDetailService,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
     
      this.showHide = true;
      if(this.globalDataService.isBrowser){
         if(localStorage.getItem('userLoginDetail'))
       {
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
        this.userExist=true;
      }
      }
     
     
    }
    ngOnChanges(change:{currentLanguageData:SimpleChange,getcartData:SimpleChange}){
        if(Object.keys(this.currentLanguageData).length>0){
           
          this.cartDetailData = this.cartdata.data;
          this.getPaymentMethod();
         // alert(1);
         // console.log(JSON.stringify(this.cartDetailData));
        }
    }
  
  
   //Function for calling API for payment Method*********************
   getPaymentMethod(){
     let URL = this.baseUrl+'front/payment/payment_method';
     // let URL = 'http://10.0.4.21:1337/front/payment/payment_method';
          let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
          this.httpService.createPostRequest(URL,data).subscribe(response=>{
          if(response.status){
            this.paymentMethod = response['data'];
            this.isPaymentData = true;
            //console.log(JSON.stringify(this.paymentMethod )); 
           }
         });
     }

     giftCoupon(isValid)
     {
     this.isFormSubmit = true;
      if(!isValid)
      return ;
      else
      {
        let URL = this.baseUrl+'front/giftcard/gift_id_detail';
        let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],gift_code:this.couponCredentionalData['gift_code'],pin:this.couponCredentionalData['pin']};
        // let encrypt_data = this.encryptionservice.encrypt_data(data);
      
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status)
        {
          
         
          this.isGiftVoucher = false;
          this.isGiftVoucherAmount = true
          this.couponCredentionalData = {};
          this.isFormSubmit = false;
          this.cardamount=response['data'].card_amount;
          this.cardid=response['data'].id;
        }
        else
        {
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
            timeout: 1000, // Default is 3000
          });
        }
        });
      }
      
    }


    applyGiftAmount(isValid)
    {
      this.isFormSubmit = true;
      if(!isValid)
      return ;
      else{
      this.isApplyAmountSubmit = true;
      // if(!(this.cardamount >= this.applyAmount))
      // return false;
      if((this.cardamount < this.applyAmount) || (this.applyAmount > this.cartDetailData.grand_total) )
      return false;
     let URL = this.baseUrl+'front/basket/apply_gift_code';
    //console.log("this.cartdata=="+JSON.stringify(this.cartdata))
             let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],amount:this.applyAmount,gift_id:this.cardid,transaction_id:this.cartdata.data['transaction_id']};
             // let encrypt_data = this.encryptionservice.encrypt_data(data);
            //  alert(this.cartdata['transaction_id'])
             this.httpService.createPostRequest(URL,data).subscribe(response=>{
            this.isGiftVoucher = false;
             this.isGiftVoucherAmount = false;
             this.applyAmount = 0;
            if(response.status)
             {
               this.couponCredentionalData = {};
               this.isFormSubmit = false;
               //this.paymentType = '';
               this.needToloadCartDetails.emit({'data':'','status':'true'});
             }
             else
             {
              if(!isValid)
              return ;
             }
             
             });
       }
  }



     openGiftCodeForm(){
     
      this.isGiftVoucher = true;
     }
    //Function FOr Payment Options *************************************
    payment_mode(payment_type:string){
      for(let i = 0;i<this.paymentMethod.length;i++)
      if(this.paymentMethod[i]['code'] == payment_type){
          this.paymentMethodData = this.paymentMethod[i];
          break;

      }
      
      //alert("payment_mode"+payment_type);
      this.paymentType = payment_type;
      localStorage.setItem('paymentMode', this.paymentType);
      
		//this.paymentMode.emit(payment_type);

  }
/******** receive token from stripe *******/
  getStripeToken(stripeTtem){
   
    
    this.stripePaymentToken = stripeTtem['token']['id'];
     this.isLoader = false;
    this.placeOrder();
   
   // console.log("data=="+data['token']['id'])
  }
  
   //FUnction to place order ************************************

   placeOrder(){
    this.isPayPalForm = true;
   // alert(this.paymentType);
     let billaddress_id = '';

     let giftAppliedAmount ;
     if("gift_amount" in this.cartDetailData )
     giftAppliedAmount = this.cartDetailData.gift_amount; 

     if(this.paymentType==''){
      this.flashMessagesService.show('Please select any option for payment!', {
        classes: ['alert', 'alert-danger'], 
        timeout: 1000, 
      });
    }
    else if(this.paymentType == 'STRIPE' && this.stripePaymentToken == ''){
      this.isLoader = true;
      //alert($("#STRIPE").length)
     // document.getElementById("STRIPE").removeAttribute("checked");
    // $("#STRIPE").prop("checked",false);
     document.getElementById("stripeTokenSubmit").click();
     return false;
      //this.globalData.showToaster({type:'error',body:'Please select any option for payment!'});
      //$("#STRIPE").prop("chec")
    }
    else if(this.paymentType=='' &&  this.cartDetailData.grand_total != 0){
      this.flashMessagesService.show('Please select any option for payment!', {
        classes: ['alert', 'alert-danger'], 
        timeout: 1000, 
      });
    }
     // alert('Please select any option for payment!');
     //this.globaldata.showToaster({type:'error',body:'Please select any option for payment!'});
     else if(localStorage.getItem('isAddresschecked')==null){
      this.flashMessagesService.show('Please select Address!', {
        classes: ['alert', 'alert-danger'], 
        timeout: 1000, 
      });
     //alert('Please select Address!');
    }
     else{
      if(this.cartDetailData.grand_total == 0 )
      {
       this.paymentType = 'COD';
      }
      let URL = this.baseUrl+'front/order/place_order';
       if(localStorage.getItem('isAddresschecked')){
           let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],
                       "user_id":this.user.id,"address_id":localStorage.getItem('isAddresschecked'),
                       "payment_type":this.paymentType,"stripe_token":this.stripePaymentToken,"grand_total":this.grandTotal,type:this.typeOfCart};
           this.httpService.createPostRequest(URL,data).subscribe(response=>{
           if(response.status){
            this.palceOrderData = response['data']; 
            this.sendOrderId(this.palceOrderData);
         
             if(this.paymentType != this.PAYPAL)
             {
                //this.getCartDetail();
                this.cartDetailservice.cartdatacount = 0;
              this.router.navigate(['order-confirmation']);
             }
              else{
                this.isPayPalForm = true;
                setTimeout(()=>{
               
               $("#paypalBtn").trigger("click");
                },500);
              }
            //  this.palceOrderData = response['data']; 
            // if(this.paymentType != this.PAYPAL){
            //     this.router.navigate(['order-confirmation']);
            //   }
            //    else{
            //      this.isPayPalForm = true;
            //      setTimeout(()=>{
            //       $("#paypalBtn").trigger("click");
            //      },300);
            //    }
 
           }
           });
       }
       //alert("Address Not Selected");
       
     }
   }


   sendOrderId(palceOrderData)
   {
    let URL = appConstant.baseUrl+'front/order/send_order_email';
    
        let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"odid":palceOrderData['new_order']['odid'],type:this.typeOfCart};
        //let encrypt_data = this.encryptionservice.encrypt_data(data);
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
        //  this.paymentMethod = response['data'];
          //console.log(JSON.stringify(this.paymentMethod )); 
        
        }
        
        });
   
    //alert("Address Not Selected");
    
  
}
ngAafterViewInit()
{

}
  
}