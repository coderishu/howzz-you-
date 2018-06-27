import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
declare var $:any;
@Component({
    selector:'couponcode',
    templateUrl:'./couponcode.html'
})

export class CouponCode implements OnChanges{
  @Input('currentLanguageData') currentLanguageData:any;
  @Output('loadCartDetail')loadCartDetail = new EventEmitter();
  @Input('grandTotalOfCart') grandTotalOfCart :any; 
  @Input('couponTransactionId') couponTransactionId :any; 
    baseUrl:string = appConstant['baseUrl'];
    user:any={};
    userExist:boolean=false;
    paymentMethod:any;
    paym_type:any;
    coupon:any={};
    isApplyClicked:boolean = false;
    applyCouponCodeFlag:boolean=false;
    
   // couponTransactionId:any;
    couponCodeError:boolean=false;
    couponCodeSuccess:boolean=false;
    couponcodemsg:any;
    isCouponApplied:boolean=false;

    constructor(private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
       if(localStorage.getItem('userLoginDetail')!=null){
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
        this.userExist=true;
      }
    }
    ngOnChanges(change:{currentLanguageData:SimpleChange}){
        if(this.currentLanguageData){
         
        }
    }
     //Function for coupon code******************************************
   applyCouponCode(isValid){
   this.isApplyClicked = !isValid;
   if(localStorage.getItem('userLoginDetail')==null){
      this.applyCouponCodeFlag = true;
      $("#login").show("slow");
   }
   
   else if(!this.isApplyClicked){
     let userdetail= JSON.parse(localStorage.getItem('userLoginDetail'));
     let URL =  this.baseUrl+'front/coupon/get_coupon';
     let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],
                 "user_id":userdetail.id,"price":this.grandTotalOfCart,"coupon_code":this.coupon.couponcode,
                 "transaction_id":this.couponTransactionId}
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
         this.couponCodeSuccess = true;
         this.couponCodeError = false;
         this.couponcodemsg = response.message;
         this.isCouponApplied = true;
         this.loadCartDetail.emit(this.isCouponApplied);
         //this.getCartDetail();
         
       }
       else{
         this.couponCodeError = true;
         this.couponCodeSuccess = false;
         this.couponcodemsg = response.message;
       }
       
     });
         setTimeout(() => {
          this.couponCodeError = false;
         }, 3000);
     }
   
  }
	
  
}