import {Component,OnInit,ElementRef,Input,Output,EventEmitter, SimpleChange} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../provider/http-service';
import {appConstant} from '../../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../../provider/currencyconvert';
import {CartDetailService } from '../../../../provider/cartdetail';
//import {EncryptionService } from '../../provider/encryption';
import {OrderService } from '../../../../provider/order';
import { GlobalData } from '../../../../provider/app.global';
import { StoreSetting } from '../../../../provider/app.store-setting';
import {UserInfoService } from '../../../../provider/userInfo';


declare var $:any;
declare var bootbox:any;

@(Component({selector:'order-cancel-popup',templateUrl:'./order-cancel.html'}))

export class OrderCancelPopup implements OnInit {
  meta : Meta;
  storesettingservice:StoreSetting;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
 
  globaldata:GlobalData;
  element:ElementRef;
  orderservice:OrderService;
  user:any;
  userExist:boolean=false;
  orderDetailInfo:any=[];
  @Input('imagepath') imagepath:any;
  @Input('currentLanguageData') currentLanguageData:any;
  @Output('hideCancelPopup') hideCancel = new EventEmitter();
//  @Output('loadOrder') loadOrder = new EventEmitter();
  errorMsg:any;
  image_path:any;
  currencyJSON:any;
  divID:any;
  limittoshowdataondashboard:any;
  trackorderDetail:any={};
  isFormSubmit:boolean=false;
  cancelProduct:any={"reason_id":""};
  @Input('productData') productData:any;
 // @Input('cancelReason') cancelReasonData:Array<any> = [];
  @Input('odid') odid:any;
  @Input('allReasons') all_reason:any;
  cancelled:any;
  currencyData:any;
   
  fileObj:any;


  constructor(private userinfoservice:UserInfoService,globaldata:GlobalData,element:ElementRef,orderservice:OrderService,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
   
     this.orderservice = orderservice;
     this.element = element;
     this.globaldata=globaldata;
    
   
     this.userinfoservice = userinfoservice;

     this.limittoshowdataondashboard = appConstant.limittoshowdataondashboard;

  }
 
  ngOnChanges(change:{currentLanguageData:SimpleChange}){
    if(Object.keys(this.currentLanguageData).length>0){
      this.currencyData = this.currentLanguageData;
   }
  }

  ngOnInit(){

  }
  loadEntity(){
   return '&#163';
  }
hideCancelPopup(){
 // this.isCancelPopup = false;
 // $(".ds__cancelPopup-wrap").removeClass('ds__cancelPopup-show');
 this.hideCancel.emit({'data':'','status':false});
  this.cancelProduct ={"reason_id":""};
}
 

   


//Function to cancel order *************************
cancelOrder(isValid){
 
  this.isFormSubmit = !isValid;
  if(!this.isFormSubmit){
   let URL =  appConstant.baseUrl+'front/order/cancell_order';
   this.cancelProduct['lang']= this.currencyData['lng_code'];
   this.cancelProduct['lang_id']= this.currencyData['id'];
   this.cancelProduct['oid']= this.odid;
  // console.log(this.cancelProduct);
   
   this.httpService.createPostRequest(URL, this.cancelProduct).subscribe(response=>{
     if(response.status){
      // alert(response.msg);
     // this.globaldata.showToaster({type:'success',body:response.msg});
     // this.hideCancelPopup();
     this.hideCancel.emit({'data':'','status':true});
    // this.loadOrder.emit({});
      
      }
   });
  }
}






getFile(event)
{
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = (evet:any) => {
      //this.image_url = evet.target.result;  
      //alert(this.image_url);    
     // console.log(this.image_url);  
      
    }
    this.fileObj = event.target.files[0];
    
   //console.log(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

}



}