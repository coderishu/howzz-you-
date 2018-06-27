import {Component,OnInit,ElementRef,Input,Output,EventEmitter,SimpleChange} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../../provider/http-service';
import {appConstant} from '../../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../../provider/currencyconvert';
import {CartDetailService } from '../../../../provider/cartdetail';
import {OrderService } from '../../../../provider/order';
import { GlobalData } from '../../../../provider/app.global';
import { StoreSetting } from '../../../../provider/app.store-setting';
import {UserInfoService } from '../../../../provider/userInfo';


declare var $:any;
declare var bootbox:any;

@(Component({selector:'order-refund-popup',templateUrl:'./order-refund.html'}))

export class OrderRefundPopup implements OnInit {
  meta : Meta;
  storesettingservice:StoreSetting;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
 
  globaldata:GlobalData;
  
  imagepath:any;
  errorMsg:any;
  image_path:any;
  currencyJSON:any;
  cancelProduct:any={'reason_id':''};
  isFormSubmit:boolean=false;
  productData:any;
  @Input('orderId') orderId:string;
  @Input('orderDetailId') orderDetailId:string;
  @Input('currentLanguageData') currentLanguageData:any;
 // all_reason:any;
  @Input('allReasons') all_reason:any;
  currencyData:any={};
  refundOrderSubmitData:any = {"reason":'',"quantity":1};
  @Input('refundQuantity') refundQuantity :Array<any> = [];
  @Input("cancelReasonData") cancelReasonData:Array<any> = [];
  @Output('hideRefundPopup') hideRefundPopup = new EventEmitter();
  //@Output('loadOrder') loadOrder = new EventEmitter();
  refund:any={};
 // isRefundForm:boolean = false;
  
  fileObj:any;


  constructor(private userinfoservice:UserInfoService,storesettingservice:StoreSetting,globaldata:GlobalData,element:ElementRef,orderservice:OrderService,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
    
     this.globaldata=globaldata;
     this.storesettingservice = storesettingservice;
     this.meta  = meta;
     this.userinfoservice = userinfoservice;
    
   
  
  }


  ngOnInit(){
 
  }
 
  ngOnChanges(change:{currentLanguageData:SimpleChange,cancelReasonData:SimpleChange}){
    if(Object.keys(this.currentLanguageData).length>0){
      this.currencyData = this.currentLanguageData;
   }
   if(Object.keys(this.cancelReasonData).length>0){
    alert(JSON.stringify(this.cancelReasonData));
   }

   
  }

 changeRefundProductQuantity(event){
  this.refundOrderSubmitData.quantity = event.target.value;
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

submitRefundRequest(isValid){
  
  this.isFormSubmit = true;
  if(this.refundOrderSubmitData['reason'] == ''){
    return false;
    
  }
   
   //console.log("ccccc"+JSON.stringify(this.refundOrderSubmitData));
   this.refundOrderSubmitData['oid'] = this.orderId;
  this.refundOrderSubmitData['order_detail_id'] = this.orderDetailId;
   this.refundOrderSubmitData['lang'] = this.currencyData['lng_code'];
   this.refundOrderSubmitData['lang_id'] = this.currencyData['id'];
   this.refundOrderSubmitData['file'] = this.fileObj;
   //let encrypt_data = this.encryptionservice.encrypt_data(this.refundOrderSubmitData);
   let formData = new FormData();
   let URL =  appConstant.baseUrl+'front/refund/refund_item';
   
   Object.keys(this.refundOrderSubmitData).map((key)=>{
       formData.append(key,this.refundOrderSubmitData[key]);
   });
   this.httpService.createPostWithFile(URL,formData).then(response=>{
     if(response.status){
       this.isFormSubmit = false;
       //alert(response['msg']);
     // this.globaldata.showToaster({type:'success',body:response.msg});
    this.hideRefundPopup.emit({'data':'','status':true});
    //this.loadOrder.emit({});
      
      }
   });
 
}
// hideRefundPopUp(){
// this.loadOrder.emit({});
// }
}