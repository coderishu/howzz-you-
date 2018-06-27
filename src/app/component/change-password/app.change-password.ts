import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import {CartDetailService } from '../../provider/cartdetail';
// import {EncryptionService } from '../../provider/encryption';
import {UserInfoService } from '../../provider/userInfo';
import { GlobalData } from '../../provider/app.global';
import { Http, RequestOptions, Headers, Response } from '@angular/http';  
import { Observable } from 'rxjs/Rx';  
import { FlashMessagesService } from 'ngx-flash-messages';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
// import { StoreSettingService } from '../../provider/storesetting';
import { StoreSetting } from '../../provider/app.store-setting';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./app.change-password.html'}))

export class ChangePassword implements OnInit {
  meta : Meta;
  router:Router;
  activateRoute:ActivatedRoute;
  httpService:HttpService;
  http:Http;
  requestoptions:RequestOptions;
  headers:Headers;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  // encryptionservice:EncryptionService;
  userInfoService:UserInfoService;
  globalData:GlobalData;
  storesettingservice:StoreSetting;
  currentLanguageData:any ={};
  isFormSubmit:boolean=false;
  userData:any={};
  
  storeData:any={};
 
  constructor(private languageTranslateInfoService:LanguageTranslateInfoService,private flashMessagesService: FlashMessagesService,http:Http,userInfoService:UserInfoService,globalData:GlobalData,storesettingservice:StoreSetting,
    cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,
    title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.meta = meta;
     this.router = router;
     this.activateRoute = route;
     this.http = http;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
  
     this.globalData = globalData;
     this.userInfoService = userInfoService;
     this.storesettingservice = storesettingservice;
     this.activateRoute.queryParams.subscribe((params)=>{
      this.userData['code'] = params['code'];
    });
    

    languageTranslateInfoService.translateInfo.subscribe((data) => {
     if(data)
      {
          this.currentLanguageData = data;
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
  
  //Function to Submit user profile changes**********************************
  onSubmit(isValid)
  {
   this.isFormSubmit = true;
   if(!isValid)
   return false;
          if(this.userData['password']!=this.userData['confirm_password']){
            this.flashMessagesService.show("new Password and confirm password are not same", {
               classes: ['alert', 'alert-danger'], 
              timeout: 1000
            });
          }
            // this.globalData.showToaster({type:"error",body:'New Password and Confirm password are not same'});
            //alert("new Password and confirm password are not same")
                 else{
                   this.userData["lang_id"] = this.currentLanguageData['id'];
                   this.userData["lang"] = this.currentLanguageData['lng_code'];
                let URL = appConstant.baseUrl+'front/user/change_password_by_mail';
               this.httpService.createPostRequest(URL,this.userData).subscribe(response=>{
                if(response.status)
                {
                   this.isFormSubmit = false;
                   this.userData = {};
                   this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-success'], 
                    timeout: 1000
                  });

                  setTimeout(()=>{this.router.navigate(['/'])},2000) ;
                }
                else{
                  this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-danger'], 
                    timeout: 1000
                  });
                  }
                });
                 }
     }
 

  }
