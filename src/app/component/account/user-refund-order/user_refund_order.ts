import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute,Params} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {UrlBreadCrumbService} from '../../../provider/app.urlbreadcrum';
import {CartDetailService } from '../../../provider/cartdetail';
import { FlashMessagesService } from 'ngx-flash-messages';
import { GlobalData } from '../../../provider/app.global';
import { StoreSetting } from '../../../provider/app.store-setting';
import { NgProgress } from 'ngx-progressbar';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user_refund_order.html'}))

export class UserRefundOrder implements OnInit {
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
 //showing:boolean=false;
  orderDetail:any=[];
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
  search:string="";
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

  constructor(private title:Title,private translateService:TranslateService,private urlBreadCrumbService:UrlBreadCrumbService,private ngProgress: NgProgress,private flashMessagesService:FlashMessagesService, storesettingservice:StoreSetting,languagetranslateinfoservice:LanguageTranslateInfoService,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
    
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.orderRefund").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    },1000);
     
     this.router = router;
     this.globaldata = globaldata;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.languagetranslateinfoservice=languagetranslateinfoservice;
     this.cartdetailservice=cartdetailservice;

     this.storesettingservice = storesettingservice;
     this.meta = meta;

     if(localStorage.getItem('userLoginDetail'))
     {
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
    }


     languagetranslateinfoservice.translateInfo.subscribe((data) => {
      if(data)
      {
          this.currentLanguageData = data;
          if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
              this.isRtl = true;
          }
          else
          this.isRtl = false;
           this.getOrderDetail();
          
       }
      });
      /*for getting store setting data************************/
      storesettingservice.apiSettingsData.subscribe((data) => {
        if(data){
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

//   loadOrder(event){
//     this.getOrderDetail();
//  }

  //Function to get Order Detail of currenct user*************************
  getOrderDetail()
  {
    if(this.userExist)
    {
      this.ngProgress.start();
      let URL =  appConstant.baseUrl+'front/refund/refund_product_list';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id,"search":this.search};
      //this.showing=false;
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       // this.showing=!this.showing;
        this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/order-refund']);
      this.ngProgress.done();
        if(response.status)
        {
          this.orderDataReceived = true;
          this.orderDetail = response;
          this.orderdata = response.data;
        }
      });
    }
  }
  searchApply()
  {
    this.getOrderDetail();
  }

  /******************************************************************* 
 // Function to navigate user by selecting option drop down************
 **********************************************************************/
 navigateToOptionChange(event,refundDetail)
 {
  // if(event.target.value=='cancel'){
  // this.isCancelPopupOpen = true;
  // this.showCancelPopup(product,product.oid);
   
  // }
  // else if(event.target.value=='refund'){
  //   this.isRefundPopupOpen = true;
  //   setTimeout(()=>{ $('#refund-popup').modal('show');},500);
  //   this.showRefundPopup(product);
     
  //   }
  
    if(event.target.value=='viewdetail'){
     this.router.navigate(['/account/view-refund',refundDetail.refund_id]);
   }

  }

}
