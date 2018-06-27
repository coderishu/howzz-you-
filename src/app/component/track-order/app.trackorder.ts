import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import {CartDetailService } from '../../provider/cartdetail';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { GlobalData } from '../../provider/app.global';
import { StoreSetting } from '../../provider/app.store-setting';
import { NgProgress } from 'ngx-progressbar';
import {saveAs as importedSaveAs} from 'file-saver';
//import {saveAs as importedSaveAs} from 'file-saver';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./trackorder.html'}))

export class TrackOrder implements OnInit {
  meta : Meta;
  globaldata:GlobalData;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  color:any = appConstant['color'];
  user:any;
  //userExist:boolean=false;
  reviewData:any=[];
  image_path:any;
  starcount:any;
  order_id:any;
  oid:any='';
  productData:any = {};
  defaultcurrency:any;
  cancelled_status:any;
  refund_status:any = 0;
  productID:any;
  trackOrderDetail:any;
  currencyJSON:any;
  storeSystemData:any = {};
  storeData:any = {};
  userComment:string = ''
  userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
  currentLanguageData:any={};
  isRtl:boolean=false;
  trackOrder:any = {};
  isFormSubmit:boolean = false;
  isOrderDetail:boolean = false;

  constructor(private ngProgress: NgProgress,private languagetranslateinfoservice:LanguageTranslateInfoService,private storesettingservice:StoreSetting,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.router = router;
     this.route = route;
     this.storesettingservice = storesettingservice;
     this.globaldata=globaldata;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
    
     //this.starcount = appConstant.starCount;
     this.meta = meta;
    
    //  this.route.params.subscribe(params=>{
    //    this.order_id = params['order_id'];
    //    this.oid = params['oid'];
    //  });

   

    if(localStorage.getItem('userLoginDetail')){
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
    }
   //Getting Store info************************************
      storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
         this.storeSystemData = data.SYSTEM;
         this.storeData = data.STORE.seo;
         //*******************SET META TAGS********************************* */
        this.meta.updateTag({name:"title",content:this.storeData.page_title});
        this.meta.updateTag({name:"keywords",content:this.storeData.meta_key});
        this.meta.updateTag({name:"description",content:this.storeData.meta_desc});
        this.meta.updateTag({name:"og:title",content:this.storeData.page_title});
       // this.meta.updateTag({name:"og:image",content:cat_basic_path+catInfo.category_image});
        this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc});
        this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title});
        this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc});
       // this.meta.updateTag({name:"twitter:image",content:this.storeData.page_title});
         }
      });

      languagetranslateinfoservice.translateInfo.subscribe((data) => {
        if(data)
        {
            this.currentLanguageData = data;
            if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
                this.isRtl = true;
            }
            else
            this.isRtl = false;
           //this.getProductDetail();
            
         }
        });
  }
  ngOnInit(){
    $("#track-order").show("slow");
  
  }
   /**************************************************** 
  //Function to close Popup *****************************
  ******************************************************/
  closeTrackOrderModel(){
    $("#track-order").hide("slow");
   // this.router.navigate(["/"]);
  }

//  resendGiftCardEmail(){
//    let URL =  appConstant.baseUrl+'front/order/send_order_email';
//       let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],odid:this.order_id,type:"Bygift"};
//      // let encrypt_data = this.encryptionservice.encrypt_data(data);
//       this.httpService.createPostRequest(URL,data).subscribe(response=>{
//         this.ngProgress.done();
//         if(response.status){
          
//         }
//       });
//  }
  //Function to get order detail of product*****************************
  trackMyOrder(isValid){
    this.isFormSubmit = !isValid;
    if(this.isFormSubmit)
    return; 
    
    this.ngProgress.start();
    //OD1525263803521/5ae320bfd277b1ec3ffd8111
      let URL =  appConstant.baseUrl+'front/order/get_particular_order_detail';
      let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],shipping_id:this.trackOrder.tracking_code,email:this.trackOrder.email,oid:this.oid};
     // let encrypt_data = this.encryptionservice.encrypt_data(data);
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
        this.ngProgress.done();
        $("#track-order").hide();
        if(response.status){
          this.trackOrder = {};
          this.productData = response.data;
          if(this.productData['order_data'])
           this.isOrderDetail = true;
           else
          this.isOrderDetail = false;
          if(response.data.order_data.order_status=='Cancelled')
          this.cancelled_status = 1;
          else
          this.cancelled_status = 0;
          if(response.data.order_data.refund_status)
          this.refund_status = response.data.order_data.refund_status;
         // alert(this.cancelled_status);
          this.getTrackOrder();
        }
      });
    }
  
 //Function to show track order*****************************************
  getTrackOrder(){
    let URL =  appConstant.baseUrl+'front/order/get_track_order';
    let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],order_id:this.productData['order_id'],order_detail_id:this.productData['order_data']['order_detail_id'],cancelled:this.cancelled_status,refund_status:this.refund_status};
   /// let encrypt_data = this.encryptionservice.encrypt_data(data);
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
        this.trackOrderDetail = response.data;
       }
    });
  }

//   //Function to rate product********************************************
//  rateProduct(productId,URL_data){
//   let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
//   localStorage.setItem('productURL',JSON.stringify(URL_data));
//   let URL =   appConstant.baseUrl+'front/review/check_review_product';
//   let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],product_id:productId,user_id:userDetail.id};
//   //let encrypt_data = this.encryptionservice.encrypt_data(data);
//     this.httpService.createPostRequest(URL,data).subscribe(response=>{
//       if(response.status){
//          this.router.navigate(['/user-ratings',productId]);
//         }
//         else{
//         //  this.globaldata.showToaster({type:'error',body:response.msg});
//           }
//     });
 
// }
// //Function to make URL***********************************************
//   makeURL(urlData,qyeryParams){
//   this.router.navigate(urlData,{queryParams:qyeryParams});
//  }
  
// //Functio to add a product to cart***********************************
// addToCart(sku,associate,event,product_id,vendor_id,currencycode,quantity,urldata)
// {
//   let currencyID = this.currencyJSON[currencycode].id;
//   let URL =  appConstant.baseUrl+'front/basket/add_to_cart';
//   let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],product_id:product_id,vendor_id:vendor_id,currency_id:currencyID,quantity:quantity,shipping_id:'',user_id:this.user.id,sku:sku,associate:associate,urldata:urldata};
//  // let encrypt_data = this.encryptionservice.encrypt_data(data);
//    this.httpService.createPostRequest(URL,data).subscribe(response=>{
//     if(response.status){
//       this.router.navigate(["/cart"]);
//       //this.globaldata.showToaster({type:"success",body:response['msg']});
//     }
//    // else
//     // this.globaldata.showToaster({type:"error",body:response['msg']});
      
//    });

//  }

//  //*********communication ***********************************
// addConversation()
// {
 
  
//   if(this.userComment == '')
//   return false;
//   let userId = this.userDetail['id'];
//   let vendorId = this.productData['order_data']['vendor_id'];
//   let orderDetailId = this.productData['order_data']['order_detail_id'];
//   let refundId = this.productData['order_data']['refund_detail']['id'];
//   let URL =   appConstant.baseUrl+'front/refund/refund_communication';
//   let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],order_detail_id:orderDetailId,user_id:userId,comment:this.userComment,refund_id:refundId,vendor_id:vendorId};
//   //let encrypt_data = this.encryptionservice.encrypt_data(data);
//    this.httpService.createPostRequest(URL,data).subscribe(response=>{
//     if(response.status){
//       this.userComment = '';
//      // this.router.navigate(["/cart"]);
//      // this.globaldata.showToaster({type:"success",body:response['msg']});
//      // this.getProductDetail();
//     }
//    // else
//    //  this.globaldata.showToaster({type:"error",body:response['msg']});
      
//    });

//  }
//  getInvoice(orderId:string){
  
//     //let userDetail = JSON.parse(localStorage.getItem('currentUser'));
  
//   let URL =  appConstant.baseUrl+'front/order/invoice_html';
//   let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:orderId};
//   //let encrypt_data = this.encryptionservice.encrypt_data(data);
//   //console.log(orderId)
  
//       this.httpService.createPostRequestForTextHtml(URL,orderId).subscribe(response=>{
//       this.sendPdfHtml(response,orderId);
     
//  });
//  }
//  sendPdfHtml(response:any,orderId:string){
//  // alert(1)
//     let URL =   appConstant.baseUrl+'front/order/invoice_pdf';
//   let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:orderId,res_data:response};
//  // let encrypt_data = this.encryptionservice.encrypt_data(data);
//   //console.log(orderId)
//     this.httpService.createPostRequest(URL,data).subscribe(response=>{
//       if(response.status){
//         this.downLoadInvoicePdf(response.data);
//         }
//         else{
//         //  this.globaldata.showToaster({type:'error',body:response.msg});
//           }
//  });
// }
// downLoadInvoicePdf(url){
    
 
//   //console.log(orderId)
//    this.httpService.downloadFile(url).subscribe(blob=>{
//       importedSaveAs(blob, 'invoice');
     
//  });
// }

//  conversOnKeyPress(event){
// 	  if(event.which == 13)
// 	  this.addConversation();
// 	  //console.log(event.which)

//   }
}