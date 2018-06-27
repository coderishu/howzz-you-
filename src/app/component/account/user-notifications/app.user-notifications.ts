import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { GlobalData } from '../../../provider/app.global';
import {TranslateService} from '@ngx-translate/core';

import { StoreSetting } from '../../../provider/app.store-setting';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-notifications.html'}))

export class UserNotifications implements OnInit {
  meta:Meta;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  
  storesettingservice:StoreSetting;
  user:any;
  userExist:boolean=false;
  storeData:any={};
  currentLanguageData:any={};
  isRtl:boolean=false;
 
  constructor(private title:Title,private translateService:TranslateService,private globalDataService:GlobalData,private languageTranslateService:LanguageTranslateInfoService,storesettingservice:StoreSetting,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.translateService.get("pageTitle.account.newAddress").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.languageTranslateService=languageTranslateService;
     this.meta = meta;
     this.storesettingservice=storesettingservice;
    

     languageTranslateService.translateInfo.subscribe((data) => {
      
      if(data){
        if(this.globalDataService.isBrowser){
           if(localStorage.getItem('userLoginDetail')!=null){
          this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
          this.userExist=true;
        }
        }
       
      this.currentLanguageData = data;
      if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
          this.isRtl = true;
      }
      else
      this.isRtl = false;
      // this.getAddress();
  
      }
});


     /*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
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
  }
  ngOnInit(){
  
  }
  loadEntity(){
   return '&#163';
  }
   
}