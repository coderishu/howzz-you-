import{Component,ViewChild,HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {Meta,Title} from '@angular/platform-browser';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang'
import { HttpService } from '../../provider/http-service';
import {Loader} from '../../model/loader/loader.page.component';
import {appConstant} from '../../constant/app.constant';
import { ModelAlertPopup } from '../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';
import { MetaService } from '@ngx-meta/core';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import { StoreSetting } from '../../provider/app.store-setting';
import { NgProgress } from 'ngx-progressbar';
import { GlobalData } from '../../provider/app.global';

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'ng-view',
    templateUrl:'./home.html',

    //  providers: [DataService]

})
export class Home{
    //router:Router;
    //  dataService:DataService;
       //loaderOb:Loader;
       isRtl:boolean = false;
       currentLanguageData:any;
       staticBlockData:any;
       baseUrl:string = appConstant['baseUrl'];
       color:any = appConstant['color'];
       staticBlocksData:any = null;
       staticBlockSpecialOffers:string = "special_offer";
       paymentMode:string = "payment_mode";
       smartPhone:string = "smart_phone";
       perfumeAndBeauty:string = "perfume_beauty";
       saleOffer:string = "sale_and_offer";
       shopNowStaticBlock:string = "shop_now";
       mobileCategory:string = "5a7aa8985f79f9558411017d";
       womenCategory:string = "5a7aa8985f79f9558411017d";
       homeCategorySectionData:Array<any> = [];
       homeCategory:Array<any> = [];
       bannerData:any = [];
       bannerIndex = 0;
       maxRating:number = 5;
       storeSetting:Object = {};
       rate:number = 2;
       loadingHomeDataInterval:any;
       isLoadMore:boolean = true;
       basicpath:any;
       throttle:number = 1000;
       isLoader:boolean = true;
       metaImagePath:any = appConstant['logoPath'];
 
      @ViewChild(ModelAlertPopup) modelAlertOb:ModelAlertPopup;
       
    constructor(private metatag:Meta,private globalDataService:GlobalData,private ngProgress: NgProgress,private storeSettingOb:StoreSetting,private currencyConvertService:CurrencyConvertService,private breadCrumService:UrlBreadCrumbService,private readonly meta: MetaService,private sanitizer: DomSanitizer,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
     
       this.router=router;
       breadCrumService.change({});
       if(this.globalDataService.isBrowser)
       $("html, body").animate({ scrollTop: 0 }, "slow");
      /****** for store Setting *****/
      storeSettingOb.apiSettingsData.subscribe((data) => {
        if(data){
         this.storeSetting = data;
          let metaInfo = this.storeSetting['STORE'].seo;
       //*******************SET META TAGS********************************* */
         this.metatag.updateTag({name:"title",content:metaInfo.page_title?metaInfo.page_title:''});
         this.metatag.updateTag({name:"keywords",content:metaInfo.meta_key?metaInfo.meta_key:''});
         this.metatag.updateTag({name:"description",content:metaInfo.meta_desc?metaInfo.meta_desc:''});
         this.metatag.updateTag({name:"og:title",content:metaInfo.page_title?metaInfo.page_title:''});
         this.metatag.updateTag({name:"og:image",content:this.metaImagePath});
         this.metatag.updateTag({name:"og:description",content:metaInfo.meta_desc?metaInfo.meta_desc:''});
         this.metatag.updateTag({name:"twitter:title",content:metaInfo.page_title?metaInfo.page_title:''});
         this.metatag.updateTag({name:"twitter:description",content:metaInfo.meta_desc?metaInfo.meta_desc:''});
         this.metatag.updateTag({name:"twitter:image",content:this.metaImagePath});
  
        }
     });
     
          languageTranslateInfoService.translateInfo.subscribe((data) => {
          if(data){
                     this.currentLanguageData = data;
                    this.loadBannerData();
                    if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
                        
                        this.isRtl = true;
                    }
                    else
                    this.isRtl = false;
                }
         });
    }  
       
    // Function to run flexiSlider *******************************
    runSlider(){
     // alert("hey");
     if(this.globalDataService.isBrowser){
        $('.banner-sec .flexslider').flexslider({
        animation : "slide",
        slideshowSpeed:3000,
      });
     }
    
    }

  //Function to get banner list************************************* 
loadBannerData(){
      this.ngProgress.start();
      let url = this.baseUrl + "front/webservice/get_banner_list";
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
      this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      this.ngProgress.done();
       setTimeout(()=>{
         this.addSliderOnBannerSection();
          this.getHomeSettingData();
       },200);
       //******************************************************************* */
     
      if(response['status'] == true && response['banner_data'].length > 0){
          this.bannerData = response.banner_data;
          //this.runSlider();
          this.basicpath = response.basic_path;
      }
    
    });
   
}
  // Call Banner API********************************************
  getHomeSettingData(){
    // this.ngProgress.start();
     let URL = appConstant.baseUrl+'front/homepage/homepage';
     let dataToSend = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
     this.httpService.createPostRequest(URL,dataToSend).subscribe(response=>{
     if(response.status){
       this.homeCategorySectionData = response['data'];
       this.addNewBlock('event');
      
       }
    });
 
   }
   
  
  addNewBlock(event){
    
        if(this.homeCategorySectionData.length == this.homeCategory.length)
          this.isLoader = false;
   // alert(event.status)
      if(this.homeCategorySectionData.length > this.homeCategory.length){
        this.homeCategory.push(this.homeCategorySectionData[this.homeCategory.length]);  
      }
     
      
    }
    ngOnInit() {
    
  }
addSliderOnBannerSection(){
if(this.globalDataService.isBrowser){
       
        var bannerSlider = $('.banner-sec .flexslider').flexslider({
            animation : "slide",
            slideshowSpeed:3000,
        });
    
      }
}
     ngAfterViewInit(){
    //   this.setOwlCrowsal();
      this.breadCrumService.toggleBreadCrumb(false);
      
     

  }
}
