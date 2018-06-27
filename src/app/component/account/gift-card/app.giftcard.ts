import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { FlashMessagesService } from 'ngx-flash-messages';
import { StoreSetting } from '../../../provider/app.store-setting';
import { GlobalData } from '../../../provider/app.global';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import {PaymentInfoService } from '../../../provider/paymentInfo';
import { NgProgress } from 'ngx-progressbar';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;
declare var bootbox:any;

@(Component({selector:'ng-view',templateUrl:'./giftcard.html'}))

export class GiftCard implements OnInit {
  baseUrl:string = appConstant['baseUrl'];
  bannerHeading:string = "Design gift card";
  bannerImage:string = "assets/images/gift-card-banner.jpg";
  bannerImageTitle:"image";
  isFormSubmit:boolean=false;
  formData:any={};
  currentLanguageData:any;
  readCardData:Object = {};
  httpService:HttpService;
  sortingOrder:string='';
  secondtable:boolean=false;
  used_data:any={};
  showing:any=[];
  coupon:any={};
  isVisible:boolean=false;
  couponCredentionalData:any={};
  voucherused:any=[];
  showtable:Array<any> = [];
  storesettingService:StoreSetting;
  isRtl:boolean=false;
  isOrder:boolean=false;
  applyAmount:number;
  color:string=appConstant['color'];
  defaultcurrency:Object = {};
  // readCardApi:string = 'front/giftcard/gift_voucher_used_record';
  storesettingData:Object = {};
  giftAmountsData:Array<any> = [];
  giftcardDetailData:Array<any> = [];
  currencyConvertService:CurrencyConvertService;
  loadAmountLength:number = 4;
  isOtherAmount:boolean = true;
  router:Router;
  currentUser = JSON.parse(localStorage.getItem('userLoginDetail'))?JSON.parse(localStorage.getItem('userLoginDetail')):null;
  defaultCurrencyData:Object  = {};
  showGiftCardForm:boolean = false;
  isCouponFormSubmit:boolean = false;

  constructor(private translateService:TranslateService,private title:Title,router:Router,private flashMessagesService : FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,private urlBreadcrumbService:UrlBreadCrumbService,currencyConvertService:CurrencyConvertService,meta:Meta,storesettingService:StoreSetting,httpService:HttpService){
    
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.giftcard").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    },1000);
    
   this.httpService = httpService;
   this.storesettingService = storesettingService;
   this.languageTranslateService=languageTranslateService;
   this.currencyConvertService =  currencyConvertService;
   this.router = router;

      storesettingService.apiSettingsData.subscribe((data) => {
      if(data){
         this.storesettingData = data;
         this.storesettingData['STORE']['breadcrum']['catalog'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
      }
      });
      languageTranslateService.translateInfo.subscribe((data) => {
        if(data)
        {
          this.currentLanguageData = data;
          if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
            this.isRtl = true;
          }
          else
            this.isRtl = false;
            this.getGiftamount();
        }
  
  });
  }
  ngOnInit()
  {

  }
  applyCoupon(isValid)
  {
    
    this.isCouponFormSubmit = !isValid;
   // alert("this.isCouponFormSubmit"+this.isCouponFormSubmit+"isValid"+isValid);
   if(!this.isCouponFormSubmit)
   {
    this.isOrder = false;
    let URL = appConstant.baseUrl+'front/giftcard/gift_voucher_used_record';
        let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],gift_code:this.couponCredentionalData['gift_code'],pin:this.couponCredentionalData['pin']};
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status)
        {
          if(response['data']['use_record']=="")
          {
            this.isOrder=!this.isOrder;
          }
           this.used_data=response['data'];
           this.used_data.is_order = this.isOrder;
          this.couponCredentionalData = {};
           this.showtable.push(this.used_data);
          this.isFormSubmit = false;
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
   getGiftamount()
   {
    let URL = appConstant.baseUrl+'front/giftcard/gift_amount';
    let dataToSend2 = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id']};
    // let dataToSend = this.encryptionservice.encrypt_data(dataToSend2);
    this.httpService.createPostRequest(URL,dataToSend2).subscribe(response=>{
      //this.getCartDetail();
      if(response.status){
        //this.giftAmountData = response['data'].slice(0,this.loadAmountLength);
        this.giftAmountsData = response['data'];
        if(this.giftAmountsData.length > 0)
        this.formData['amount'] = this.giftAmountsData[0]['amount'];
        
     
        //this.storeSettingData = data;
      }
    })
    }

/********* choose gift card amount********/

//Function to save purchase data*****************************
  saveGiftCard(Valid)
  {
    let userId = this.currentUser?this.currentUser['id']:'';
    this.isFormSubmit = true;
    //alert(this.formData['amount']);
    if(this.formData['cemail']!==this.formData['email'])
    {

    }
    else{
      if(Valid)
      { 
       // alert(1)
        let browser_id = Cookie.get('browser_id');
        let URL = appConstant.baseUrl+'front/basket/add_to_cart';
      let dataToSend2 = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],user_id:userId,currency_id:this.currencyConvertService.currentCurrencyData['currency_id'],"session_id":browser_id,type:appConstant['giftCode'],receiver_email:this.formData['email'],receiver_name:this.formData['receiver_name'],name:this.formData['name'],card_amount:this.formData['amount'],message:this.formData['message']};
      // let dataToSend = this.encryptionservice.encrypt_data(dataToSend2);
     // console.log(JSON.stringify(dataToSend))
      this.httpService.createPostRequest(URL,dataToSend2).subscribe(response=>{
        if(response.status)
        {
          localStorage.setItem("isGift",appConstant["giftCode"]);
          localStorage.setItem('paymentAcess','true');
         this.router.navigate(['/checkout']);
        }
      });
       
      }
    }

  }
 
 
}