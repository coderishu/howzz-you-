import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router, ActivatedRoute, Params} from '@angular/router';
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

@(Component({selector:'ng-view',templateUrl:'./view_refund.html'}))

export class ViewRefund implements OnInit {
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
  userComment:string = ''
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
  refundid:any;
  all_reason:any;
  divID:any;
  currencyJSON:any;
  image_url:any;
  fileObj:any;
  searching:any={};
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
  orderdata:any;
  status:any='';
  color:any = appConstant['color'];
  metaImagePath:any = appConstant['logoPath'];

  constructor(private title:Title,private translateService:TranslateService,private activatedRoute: ActivatedRoute,private urlBreadCrumbService:UrlBreadCrumbService,private ngProgress: NgProgress,private flashMessagesService:FlashMessagesService, storesettingservice:StoreSetting,languagetranslateinfoservice:LanguageTranslateInfoService,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
    
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.refundView").subscribe((res)=>{
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

    this.activatedRoute.params.subscribe((params: Params) => {
        this.refundid = params['id'];
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
  ngOnInit()
  {
    
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
      let URL =  appConstant.baseUrl+'front/refund/refund_product_conversation';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id,"refund_id":this.refundid,"searching":this.searching};
     // this.showing=false;
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
      //  this.showing=!this.showing;
        this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/view-refund']);
      this.ngProgress.done();
        if(response.status)
        {
          this.orderDataReceived = true;
          this.orderDetail = response;
          this.orderdata = response.data;
          //alert(12345);
          //console.log(JSON.stringify(this.orderdata));

        }
      });
    }
  }

  addConversation(isValid)
  {
    this.isFormSubmit = !isValid;
    //alert(this.isFormSubmit);
    if(this.userComment == '' && this.isFormSubmit)
    return false;
    let userId = this.user['id'];
    let vendorId = this.orderdata['vendor_id'];
    let orderDetailId = this.orderdata['order_detail_id'];
    let URL =   appConstant.baseUrl+'front/refund/refund_communication';
    let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],order_detail_id:orderDetailId,user_id:userId,comment:this.userComment,refund_id:this.refundid,vendor_id:vendorId};
    //let encrypt_data = this.encryptionservice.encrypt_data(data);
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
        this.userComment = '';
        this.isFormSubmit = false;
       // this.router.navigate(["/cart"]);
       // this.globaldata.showToaster({type:"success",body:response['msg']});
        this.getOrderDetail();
      }
     });

   }




}
