import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
import {CartDetailService } from '../../../provider/cartdetail';
import {PaymentInfoService } from '../../../provider/paymentInfo';
import {Meta,Title} from '@angular/platform-browser';
import { StoreSetting } from '../../../provider/app.store-setting';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import { GlobalData } from '../../../provider/app.global';

declare var $:any;
@Component({
    selector:'shipping',
    templateUrl:'./shipping.html'
})

export class Shipping implements OnChanges{
  @Input('currentLanguageData') currentLanguageData:any;
  @Input('getcartData') getcartData:any={};
  @Output('needToloadCartDetails')needToloadCartDetails = new EventEmitter();
  @Input('continueButtonStatus') continueButtonStatus:any;
 // @Output('showNextSection2')showNextSection2 = new EventEmitter();
    baseUrl:string = appConstant['baseUrl'];
   @Input('isAddressAvailable') isAddressAvailable:any; 
    user:any={};
    userExist:boolean=false;
    paymentMethod:any;
    paym_type:any;
    storeData:any;
    productAvailabilityArr:any=new Array();
    errormsg_not_available:boolean=false; 
    cartlength:any;
    imagepath:any;
    errormsg:any;
    emptyCart:boolean=false;
     grandTotal:any;
    couponTransactionId:any;
    cartdata:any;
    isCartDataAvailable:boolean=false;
    selectedShippingID:any;
    nextSection:any = appConstant['PAYMENT'];

    constructor(private globalDataService:GlobalData,private currencyconvertservice:CurrencyConvertService,private paymentinfoservice : PaymentInfoService,private storeSettingService:StoreSetting,private meta:Meta,private cartdetailservice:CartDetailService,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
       /****** for store Setting *****/
       storeSettingService.apiSettingsData.subscribe((data) => {
        if(data){
            this.storeData = data.STORE.seo;
        }
    });
      if(this.globalDataService.isBrowser){
        if(localStorage.getItem('userLoginDetail')!=null){
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
        this.userExist=true;
      }
      }
       
    }
    ngOnChanges(change:{currentLanguageData:SimpleChange,getcartData:SimpleChange}){
        if(this.currentLanguageData && Object.keys(this.getcartData).length>0){
          // alert(78);
             this.cartdata = this.getcartData.data;
           //  console.log( this.cartdata);
             //this.selectedShippingID = this.cartdata
             this.isCartDataAvailable = true;
             this.imagepath = this.cartdata.thumb_path;
         }
         
    }
	
    selectShipping(event,cart_id,selectedShipping){
      let URL =  this.baseUrl+'front/basket/update_shiping_price';
      let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:cart_id,courier_service_id:selectedShipping['courier_service_id'],price:selectedShipping['rule_data'][0]['rules_attributes'][0]['shiping_price'],courier_id : selectedShipping.courier_id};
      
       this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status){
          this.needToloadCartDetails.emit({'data':'','status':'true'});
         
           }
       });
      }

    

// Function to click ***************************8
// showHideSections(event){
//     $(event.currentTarget).parent(".chckout-btn-wrap").hide();
//     $(event.currentTarget).parents(".ship-wrap").find(".chkout-edit").show().attr("data-target","0");
//     $(event.currentTarget).parents(".chkout-shipping").find(".chkout-frm-wrp").css("display","none")
//     $(event.currentTarget).parents(".chkout-shipping").next(".chkout-shipping").find(".chckout-btn-wrap").show(); 
//     $(event.currentTarget).parents(".chkout-shipping").next(".chkout-shipping").css("display","block").find(".chkout-frm-wrp").css("display","block");
   
// }
    
}