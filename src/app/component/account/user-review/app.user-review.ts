import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { GlobalData } from '../../../provider/app.global';
import { StoreSetting } from '../../../provider/app.store-setting';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;
declare var bootbox:any;

@(Component({selector:'ng-view',templateUrl:'./user-review.html'}))

export class UserReview implements OnInit {
  color:any = appConstant['color'];
  globaldata:GlobalData;
  storesettingservice:StoreSetting;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  user:any;
  userExist:boolean=false;
  reviewrecd:boolean = false;
  reviewData:any=[];
  image_path:any;
  meta:Meta;
  currentLanguageData:any={};
  isRtl:boolean=false;
  storeData:any={};
  metaImagePath:any = appConstant['logoPath'];
 

  constructor(private title:Title,private translateService:TranslateService,private ngProgress: NgProgress,private urlBreadcrumbService:UrlBreadCrumbService,private flashMessagesService: FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,storesettingservice:StoreSetting,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.translateService.get("pageTitle.account.review").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     this.router = router;
     this.route = route;
     this.globaldata=globaldata;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.meta = meta;
     this.storesettingservice=storesettingservice;
      if(this.globaldata.isBrowser){
          if(localStorage.getItem('userLoginDetail')){
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
    }
      }
   

     languageTranslateService.translateInfo.subscribe((data) => {
      if(data){
       this.currentLanguageData = data;
      if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
          this.isRtl = true;
      }
      else
      this.isRtl = false;
       this.getReview();
  
      }
});
   
      /*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
         this.storeData = data.STORE.seo;
         data['STORE']['breadcrum']['account'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
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
  //Function to get review*******************************
  getReview(){
    this.ngProgress.start();
    let URL =  appConstant.baseUrl+'front/review/get_review_rating';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.ngProgress.done();
       if(response.status){
         this.reviewrecd = true;
         this.reviewData = response.data;
         this.image_path = response.urls.thumb_path;
        }
     });
  }
  //Function to show alert popup to Delete****************************
removeReviewData(review_id){
  bootbox.confirm({ 
    size: "small",
    title: appConstant.title,
    message: "Are you sure?", 
    callback: (result)=>{ 
     if(result)
      this.deleteReview(review_id);
  }
 })
}
  //Function to delete review*******************************
  deleteReview(review_id){
    let URL =  appConstant.baseUrl+'front/review/delete_review';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],review_id:review_id};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
        this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-success'], 
          timeout: 1000,
        });
         this.getReview();
        // alert(response['msg']);
        }
     });
  }

  
  //Function to make URL***************************************
  // makeURL(urlData,qyeryParams){
  //   this.router.navigate(urlData,{queryParams:qyeryParams});
  //  }
   
}