import {Component,OnInit,ElementRef} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import {OrderService } from '../../../provider/order';
import { GlobalData } from '../../../provider/app.global';
import { StoreSetting } from '../../../provider/app.store-setting';
import {UserInfoService } from '../../../provider/userInfo';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';
import {TranslateService} from '@ngx-translate/core';

declare var $:any;
declare var bootbox:any;

@(Component({selector:'ng-view',templateUrl:'./user-dashboard.html'}))

export class UserDashboard implements OnInit {
  color:any = appConstant['color'];
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
  
  imagepath:any;
  defaultcurrency:any;
  addressDetail:any=[];
  wishlistData:any=[];
  errorMsg:any;
  image_path:any;
  currencyJSON:any;
  divID:any;
  limittoshowdataondashboard:any = appConstant['limittoshowdataondashboard'];
  trackorderDetail:any={};
  isFormSubmit:boolean=false;
  cancelProduct:any={};
  productData:any;
  odid:any;
  all_reason:any;
  cancelled:any;
  storeData:any={};
  currentLanguageData:any={};
  isRtl:boolean=false;
  isCancelPopupOpen:boolean=false;
  isRefundPopupOpen:boolean=false;
  refundQuantity:Array<any> = [];
  refundOrderSubmitData:any = {"reason":'',"quantity":1};
  cancelReasonData:Array<any> = [];
  orderExist:boolean = false;
  search:any={'viewby':'','viewtype':'','status':'','page_search_key':''};
  isWishDataAvailable:boolean = false;
  metaImagePath:any = appConstant['logoPath'];
  storeSettingData:any;
  typeofAddToCart = appConstant['typeofAddToCartfromDetail'];
  //selectionOptions:Array<any>=appConstant['accountSectionSelectionArr'];

  constructor(private title:Title,private translateService:TranslateService,private ngProgress: NgProgress,private flashMessagesService:FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,private userinfoservice:UserInfoService,storesettingservice:StoreSetting,globaldata:GlobalData,element:ElementRef,orderservice:OrderService,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
  // alert("dashboard"); 
  setTimeout(()=>{
    this.translateService.get("pageTitle.account.dashboard").subscribe((res)=>{
      this.title.setTitle(res);
     });
  },1000);
 
  this.orderDetailInfo['data'] = [];
  this.wishlistData['data'] = [];
    this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.languageTranslateService=languageTranslateService;
     this.orderservice = orderservice;
     this.element = element;
     this.globaldata=globaldata;
     this.storesettingservice = storesettingservice;
     this.meta  = meta;
     this.userinfoservice = userinfoservice;
     
    

   //  this.limittoshowdataondashboard = appConstant.limittoshowdataondashboard;

     languageTranslateService.translateInfo.subscribe((data) => {
       if(this.globaldata.isBrowser){
             if(localStorage.getItem('userLoginDetail')){
      
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
        this.userExist=true;
      }
       }
   
      
      if(data)
      {
        this.currentLanguageData = data;
        if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
          this.isRtl = true;
        }
        else
          this.isRtl = false;

        this.getWishList();
        this.getAddress();
        this.orderDetails();
         this.loadCancelReason();
      }

});
    
/*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
        this.storeSettingData = data;
         this.storeData = data.STORE.seo
         //*******************SET META TAGS********************************* */
         this.meta.updateTag({name:"title",content:this.storeData.page_title?this.storeData.page_title:''});
         this.meta.updateTag({name:"keywords",content:this.storeData.meta_key?this.storeData.meta_key:''});
         this.meta.updateTag({name:"description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
         this.meta.updateTag({name:"og:title",content:this.storeData.page_title?this.storeData.page_title:''});
         this.meta.updateTag({name:"og:image",content:this.metaImagePath});
         this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
         this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title?this.storeData.page_title:''});
         this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});
 

         }
      });
    //Getting currency JSON********************************
    
  }
  ngOnInit(){ }

  loadEntity(){
   return '&#163';
  }

  //Function for getting order detail info*******************
 orderDetails(){
  
  let URL =  appConstant.baseUrl+'front/order/get_all_order_detail';

  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id,per_page:10,search:this.search}
  
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
      this.orderExist = true;
      
      // this.orderDetailInfo.push({'order_status_list':response.order_status_list});
       //this.orderDetailInfo.push({'total_record':response.total_record});
       if(response['data'].length>0){
        this.orderDetailInfo['order_status_list']=response.order_status_list;
        this.orderDetailInfo['total_record']=response.total_record;
        this.orderDetailInfo['data'] = [];
        if(response['data'].length > this.limittoshowdataondashboard){
          for(let z = 0; z< this.limittoshowdataondashboard ; z++){
            this.orderDetailInfo['data'].push(response.data[z]);
          }
        }
        else{
          for(let z = 0; z< response['data'].length ; z++){
            this.orderDetailInfo['data'].push(response.data[z]);
          }

        }
        
        //alert(this.limittoshowdataondashboard);
       // console.log(this.orderDetailInfo);
       this.imagepath = response.urls.thumb_path;
       }
     
     }
  });

 }

  //Function to get Address of currenct user******************
  getAddress(){
    if(this.userExist){
      let URL =  appConstant.baseUrl+'front/user/get_address';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id};
     
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
        this.ngProgress.done();
        if(response.status)
        {
          this.addressDetail = response.data;
        }
      });
    }
  }

   //Function to show track order*****************************
   showTrackOrder(event,val1,val2,product_id,order_status){
    this.divID = 'track_'+val1+'_'+val2;
    let cancelled;
    if(order_status=='Cancelled')
    cancelled = 1;
    else
    cancelled = 0;
    let URL =  appConstant.baseUrl+'front/order/get_track_order';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],order_id:product_id,cancelled:cancelled};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
       this.trackorderDetail[this.divID] = response.data;
       $("#track_"+val1+"_"+val2).css('display','block');
        $("."+event.target.className).addClass('ds__active-track');
       
       }
    });
  }
 //Function to hide track order*****************************
 hideTrackOrder(event,val1,val2){
  $("#track_"+val1+"_"+val2).css('display','none');
  $("#dstrack_"+val1+"_"+val2).removeClass('ds__active-track');
}

  //Function to get wishList********************************
  getWishList(){
    this.ngProgress.start();
    let user = JSON.parse(localStorage.getItem('userLoginDetail'));
    // if(localStorage.getItem("userLoginDetail")){
    //   user = JSON.parse(localStorage.getItem('userLoginDetail'));
    // }
   //alert(user.id)
    let URL =  appConstant.baseUrl+'front/order/all_wish_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"user_id":user.id};
   // console.log(JSON.stringify(data));
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
         this.isWishDataAvailable = true;
         if(response['data'].length>0){
        // this.wishlistData = response.data;
        this.wishlistData['order_status_list']=response.order_status_list;
       this.wishlistData['total_record']=response.total_record;
         this.wishlistData['data'] = [];
         if(response['data'].length > this.limittoshowdataondashboard){
          for(let b = 0; b< this.limittoshowdataondashboard ; b++){
            this.wishlistData['data'].push(response.data[b]);
          }
        }
        else{
          for(let b = 0; b< response['data'].length ; b++){
            this.wishlistData['data'].push(response.data[b]);
          }

        }
        
         this.userinfoservice.userWishlistCount = response.data.length;
         this.image_path = response.urls.thumb_path;
         }
        }
        
     });
  }

  //Function to make URL***************************************
 makeURL(urlData,qyeryParams){
  this.router.navigate(urlData,{queryParams:qyeryParams});
 }

   //Functio to add a product to cart**************************
addToCart(sku,associate,event,product_id,vendor_id,currencycode,quantity,urldata)
{
  let currencyID = this.currencyconvertservice.currentCurrencyData['id'];
  let URL =  appConstant.baseUrl+'front/basket/add_to_cart';
  let data = {"type" :this.typeofAddToCart,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:product_id,vendor_id:vendor_id,currency_id:currencyID,quantity:quantity,shipping_id:'',user_id:this.user.id,sku:sku,associate:associate,urldata:urldata};
 this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
      //alert(response['msg']);
      this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-success'],
        timeout: 1000
      });
      setTimeout(()=>{this.router.navigate(["/cart"])},1000);
    }
    else{
      this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-danger'], 
          timeout: 1000
        });
  }
      
   });

 }
 //Function to show alert popup to Delete****************************
removeWishListData(sku,productId){
//   bootbox.confirm({ 
//     size: "small",
//     title: appConstant.title,
//     message: "Are you sure?", 
//     callback: (result)=>{ 
//      if(result)
//       this.removeFromWishList(sku,productId);
//   }
//  })
   if (confirm('Are you sure you want to delete?')) {
    this.removeFromWishList(sku,productId);
  }
}
 // Function to remove a product from wishList *****************************
 removeFromWishList(sku,productId){
  let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
  let URL =  appConstant.baseUrl+'front/order/remove_to_wish_list';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],sku:sku,product_id:productId,user_id:userDetail.id};
 this.httpService.createPostRequest(URL,data).subscribe(response=>{
     if(response.status){
      this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-success'], // You can pass as many classes as you need
        timeout: 1000, // Default is 3000
      });
       setTimeout(()=> {this.getWishList()},1000);
      
       }
       else{
        this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
          timeout: 1000, // Default is 3000
        });
       }
   });
}

//Function to cancel order *************************
cancelOrder(isValid){
  this.isFormSubmit = !isValid;
  if(!this.isFormSubmit){
   let URL =  appConstant.baseUrl+'front/order/cancell_order';
   this.cancelProduct['lang']= this.currentLanguageData['lng_code'];
   this.cancelProduct['lang_id']= this.currentLanguageData['id'];
   this.cancelProduct['oid']= this.odid;
  this.httpService.createPostRequest(URL, this.cancelProduct).subscribe(response=>{
     if(response.status){
       //  alert(response['msg']);
       this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-success'], 
        timeout: 1000
      });
         this.hideCancelPopup({});
         setTimeout(()=>{this.orderDetails()},1000);
      }
   });
  }
}

 //Function to show cancel popup********************
 showCancelPopup(product_data,order_id){
 // $(".ds__cancelPopup-wrap").addClass('ds__cancelPopup-show');
  this.productData = product_data;
  this.odid = order_id;
  let URL =  appConstant.baseUrl+'front/order/all_reason';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
     this.all_reason = response.data;
     }
  });
}
//Function to hide cancel popup*********************
hideCancelPopup(data){
  this.isCancelPopupOpen = false;
   $('#cancel-popup').modal('hide');
   //setTimeout(()=>{ $('#cancel-popup').modal('hide');},500);
  if(data.status)
   this.orderDetails();
   //$(".ds__cancelPopup-wrap").removeClass('ds__cancelPopup-show');
}
 
//Function to rate product************************************
rateProduct(productId,URL_data){
  let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
  localStorage.setItem('productURL',JSON.stringify(URL_data));
  //  let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
  //  let URL =  appConstant.baseUrl+'front/review/check_review_product';
  //  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:productId,user_id:userDetail.id};
  //  this.httpService.createPostRequest(URL,data).subscribe(response=>{
  //     if(response.status){
  //        this.router.navigate(['/user-ratings',productId]);
  //       }
  //       else{
  //             this.flashMessagesService.show(response['msg'], {
  //               classes: ['alert', 'alert-danger'], 
  //                timeout: 1000 
  //            });
  //         }
  //   });
 
}

//Function to hide cancel popup*********************
hideRefundPopup(data){
  this.isRefundPopupOpen = false;
  $('#refund-popup').modal('hide');
  if(data.status)
  this.orderDetails();
 // $(".ds__cancelPopup-wrap").removeClass('ds__cancelPopup-show');
}

//Function to show refund popup********************
showRefundPopup(product:any){
  this.isFormSubmit = false;
  this.refundQuantity = [];
 // alert('product.quantity'+product.quantity);
  for(let i = 1;i<=product.quantity;i++)
  this.refundQuantity.push(i);
  //alert(JSON.stringify(this.refundQuantity));
  this.refundOrderSubmitData['oid'] = product['oid'];
  this.refundOrderSubmitData['order_detail_id'] = product['order_detail_id'];
 //$(".ds__cancelPopup-wrap").addClass('ds__cancelPopup-show');
  this.isRefundPopupOpen = true;
}
//Function to get refund reasons*********************
loadCancelReason(){
  let URL =  appConstant.baseUrl+'front/refund/refund_reason';
    let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id']};
  
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
        this.cancelReasonData = response['data'];
       // alert(JSON.stringify(this.cancelReasonData));
        //alert(this.imagepath);
      }
    });
  

}
// // Function to show refund data*****************************
// showRefundData(event,value1,value2){
//   $('#refund_'+value1+'_'+value2).css('display','block');
//  }
//  // Function to hide refund block***************************
//  hideRefund(event,value1,value2){
//    $('#refund_'+value1+'_'+value2).css('display','none');
//  } 


// Function to navigate according to choosen option ***********************
 navigateToOptionChange(event,product,product_odid){
  if(event.target.value=='cancel'){
    //alert(event.target.value);
  this.isCancelPopupOpen = true;
  //$('#cancel-popup').css("display","block");
  //setTimeout(()=>{ $('#cancel-popup').modal('show');},500);
  
   this.showCancelPopup(product,product.oid);
   }
  else if(event.target.value=='refund'){
    this.isRefundPopupOpen = true;
   // setTimeout(()=>{ $('#refund-popup').modal('show');},500);
   this.showRefundPopup(product);
     
    }
  else if(event.target.value=='vieworder'){
    this.router.navigate(['/account/order-view',product_odid,product.oid]);

  }

}

getInvoice(orderId:string){
  // alert(orderId)
  let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:orderId,order_detail_id:''};
 this.orderservice.downLoadPdf(data);
 
}
}