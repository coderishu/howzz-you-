import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { FlashMessagesService } from 'ngx-flash-messages';
import { GlobalData } from '../../../provider/app.global';
import { StoreSetting } from '../../../provider/app.store-setting';
import { NgProgress } from 'ngx-progressbar';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import {OrderService} from '../../../provider/order';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-orders.html'}))

export class UserOrders implements OnInit {
  meta: Meta;
  router:Router;
  globaldata:GlobalData;
  route:ActivatedRoute;
  httpService:HttpService;
  languagetranslateinfoservice:LanguageTranslateInfoService;
  currencyconvertservice:CurrencyConvertService;
  currentLanguageData:any={};
  cartdetailservice:CartDetailService;

  storesettingservice:StoreSetting;
  user:any;
  userExist:boolean=false;
 // trackOrder:boolean=false;
  orderDetail:any=[];
  breadCrumData:any = {};
  imagepath:any;
  defaultcurrency:any;
  isRtl:boolean=false;
  trackorderDetail:any={};
  productData:any;
  isFormSubmit:boolean=false;
  refund:any={};
  odid:any;
  all_reason:any;
  divID:any;
  currencyJSON:any;
  image_url:any;
  fileObj:any;
  isFormRefundSubmit:boolean=false;
  storeData:any={};
  search:any={'viewby':'','viewtype':'','status':'','page_search_key':''};
  searchkeyobj={'viewby':appConstant['VIEWBY'],'status':appConstant['STATUS'],'orderpagesearchkey':appConstant['ORDERPAGEGLOBALSEARCH']};
  orderDataReceived:boolean =false;
  isCancelPopupOpen:boolean=false;
  isRefundPopupOpen:boolean = false;
  refundOrderSubmitData:any = {"reason":'',"quantity":1};
  cancelReasonData:Array<any> = [];
  refundQuantity:Array<any> = [];
  orderdata:any=[];
  status:any='';
  color:any = appConstant['color'];
  metaImagePath:any = appConstant['logoPath'];
  isFilterAttrShow:boolean = false;
  storeSettingData:any;
  typeofAddToCart = appConstant['typeofAddToCartfromDetail'];
  
  //selectionOptions:Array<any>=appConstant['accountSectionSelectionArr'];

  constructor(private title:Title,private translateService:TranslateService,private orderService:OrderService,private urlBreadCrumbService:UrlBreadCrumbService,private ngProgress: NgProgress,private flashMessagesService:FlashMessagesService, storesettingservice:StoreSetting,languagetranslateinfoservice:LanguageTranslateInfoService,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.orders").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    });
    
     
     this.router = router;
     this.globaldata = globaldata;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.languagetranslateinfoservice=languagetranslateinfoservice;
     this.cartdetailservice=cartdetailservice;
     this.urlBreadCrumbService=urlBreadCrumbService;
     this.storesettingservice = storesettingservice;
     this.meta = meta;
    if(this.globaldata.isBrowser)
    {
      if(localStorage.getItem('userLoginDetail'))
      {
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
    }
    }
   
     languagetranslateinfoservice.translateInfo.subscribe((data) => {
      if(data)
      {
          this.currentLanguageData = data;
          if(this.currentLanguageData['lng_code'] == appConstant['rtl'])
          {
              this.isRtl = true;
          }
          else
          this.isRtl = false;
           this.getOrderDetail();
           this.loadCancelReason();
       }

       
      });
      /*for getting store setting data************************/
      storesettingservice.apiSettingsData.subscribe((data) => {
        if(data){
           this.storeSettingData = data;
           this.storeData = data.STORE.seo;
           
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
  }
  ngOnInit(){
 
  }
  loadEntity(){
   return '&#163';
  }

//   loadOrder(event){
//     this.getOrderDetail();
//  }

  //Function to get Order Detail of currenct user*************************
  getOrderDetail(){
    
    if(this.userExist){
      this.ngProgress.start();
      let URL =  appConstant.baseUrl+'front/order/get_all_order_detail';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id,search:this.search,per_page:10};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
      
      this.ngProgress.done();
        if(response.status){
          this.orderDataReceived = true;
          this.orderDetail = response;
          this.orderdata = response.data;
          if(this.orderdata.length)
          this.isFilterAttrShow = true;
         //console.log(JSON.stringify(this.orderdata));
          
          this.imagepath = response.urls.thumb_path;

        }
      });
    }
  }

  //Function to show track order*****************
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
   //Function to hide track order*****************
   hideTrackOrder(event,val1,val2){
    $("#track_"+val1+"_"+val2).css('display','none');
    $("#dstrack_"+val1+"_"+val2).removeClass('ds__active-track');
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
// function to upload image***************
getFile(event)
{
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = (evet:any) => {
      this.image_url = evet.target.result;
      //alert(this.image_url);
     // console.log(this.image_url);

    }
    this.fileObj = event.target.files[0];
   //console.log(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

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
//Function to hide cancel popup*********************
hideRefundPopup(data){
  this.isRefundPopupOpen = false;
  $('#refund-popup').modal('hide');
  if(data.status)
  this.getOrderDetail();
 // $(".ds__cancelPopup-wrap").removeClass('ds__cancelPopup-show');
}
//Function to refund order *************************
refundOrder(isValid){
  this.isFormRefundSubmit = !isValid;
  if(!this.isFormRefundSubmit){
    if(this.fileObj){
      this.refund.image = this.fileObj;
     // console.log(this.refund);
    }
  }
}
 //Function to hide cancel popup*********************
 hideCancelPopup(data){
   this.isCancelPopupOpen = false;
   $('#cancel-popup').modal('hide');
   //setTimeout(()=>{ $('#cancel-popup').modal('hide');},500);
  if(data.status)
   this.getOrderDetail();
   //$(".ds__cancelPopup-wrap").removeClass('ds__cancelPopup-show');
 }

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

 //Function to make URL***********************************************
 

 //Function to rate product************************************
 rateProduct(productId,URL_data){
    let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
    localStorage.setItem('productURL',JSON.stringify(URL_data));
    // let URL =  appConstant.baseUrl+'front/review/check_review_product';
    // let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:productId,user_id:userDetail.id};
    //  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    //     if(response.status){
    //        this.router.navigate(['/account/ratings',productId]);
    //       }
    //       else{
    //         this.flashMessagesService.show(response['msg'], {
    //           classes: ['alert', 'alert-danger'], 
    //           timeout: 1000, 
    //         });
    //         }
    //   });

  } 


  // Function to hide refund block***************************
  // hideRefund(event,value1,value2){
  //   $('#refund_'+value1+'_'+value2).css('display','none');
  // }

 //Functio to add a product to cart**************************
addToCart(sku,associate,event,product_id,vendor_id,currencycode,quantity,urldata)
{
  let browser_id = Cookie.get('browser_id');
  let currencyID = this.currencyconvertservice.currentCurrencyData['id'];;
  let URL =  appConstant.baseUrl+'front/basket/add_to_cart';
  let data = {"type":this.typeofAddToCart,"session_id": browser_id,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:product_id,vendor_id:vendor_id,currency_id:currencyID,quantity:quantity,shipping_id:'',user_id:this.user.id,sku:'',associate:associate,urldata:urldata};
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
      this.router.navigate(["/cart"]);
    }
    else
    alert("error")

   });

 }

 navigateToOptionChange(event,product,product_odid)
 {
  if(event.target.value=='cancel'){
  this.isCancelPopupOpen = true;
 // setTimeout(()=>{ $('#cancel-popup').modal('show');},500);
   //$('#cancel-popup').modal('show');
   this.showCancelPopup(product,product.oid);
   
  }
  else if(event.target.value=='refund'){
    this.isRefundPopupOpen = true;
    setTimeout(()=>{ $('#refund-popup').modal('show');},500);
     //$('#cancel-popup').modal('show');
     this.showRefundPopup(product);
     
    }
  else if(event.target.value=='vieworder'){
    this.router.navigate(['/account/order-view',product_odid,product.oid]);

  }

}

 //Function to Apply Filter************************************
 searchApply(event,searchType){
   //alert("searchApply");
   let selectedVal;
   if(searchType != this.searchkeyobj['orderpagesearchkey'])
    selectedVal = event.target.value;
    else
    selectedVal = $('#search_key').val();
  // alert(event.target.value+'>>>>>>>'+searchType);  
  if(searchType == this.searchkeyobj['viewby']){
    let searchTypeArr = selectedVal.split('_');
    let viewType = searchTypeArr[0];
    let viewby = searchTypeArr[1];
    this.search['viewby'] = viewby;
    this.search['viewtype'] = viewType;
    
  
  }
  else if(searchType == this.searchkeyobj['status']){
       this.search['status'] = selectedVal;
       this.status = selectedVal;
  }
  else if(searchType == this.searchkeyobj['orderpagesearchkey']){
    //alert(selectedVal);
    this.search['page_search_key'] = selectedVal;

  }
 // console.log(this.search);
   this.getOrderDetail();

 }

 getInvoice(orderId:string){
  // alert(orderId)
  let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:orderId,order_detail_id:''};
 this.orderService.downLoadPdf(data);
 
}
   

}
