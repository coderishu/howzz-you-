import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { StoreSetting } from '../../../provider/app.store-setting';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';
import { GlobalData } from '../../../provider/app.global';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;
declare var bootbox:any;
@(Component({selector:'ng-view',templateUrl:'./user-addresses.html'}))

export class UserAddresses implements OnInit {
  meta:Meta;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  color:any = appConstant['color'];
  storesettingservice:StoreSetting;
  user:any;
  userExist:boolean=false;
  addressDetail:any=[];
  storeData:any={}; 
  currentLanguageData:any;
  isRtl:boolean = false;
  metaImagePath:any = appConstant['logoPath'];
  
  constructor(private title:Title,private translateService:TranslateService,private globalDataService:GlobalData,private ngProgress: NgProgress,private flashMessagesService : FlashMessagesService ,private languageTranslateService:LanguageTranslateInfoService,storesettingservice:StoreSetting,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
    
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.address").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    });
   
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
    
     this.storesettingservice=storesettingservice;
     this.meta = meta;
       if(this.globalDataService.isBrowser){
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
          this.getAddress();
    
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
  loadEntity(){
   return '&#163';
  }
  
  
  //Function to get Address of currenct user******************
  getAddress(){
    if(this.userExist){
      this.ngProgress.start();
      let URL =  appConstant.baseUrl+'front/user/get_address';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id};
     
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
        this.ngProgress.done();
        if(response.status){
          this.addressDetail = response.data;
        }
      });
    }
  }

   //function to remove address form data******************************
   removeAddress(address_id){
     if(confirm("Are you sure want to delete?")){
      let URL =  appConstant.baseUrl+'front/basket/remove_address';
      let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:address_id,user_id:this.user.id};
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
           if(response.status){
             this.getAddress();
             }
         });
     }
//     bootbox.confirm({ 
//       size: "small",
//       title: appConstant.title,
//       message: "Are you sure?", 
//       callback: (result)=>{ 
//       if(result){
//       let URL =  appConstant.baseUrl+'front/basket/remove_address';
//       let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:address_id,user_id:this.user.id};
//       this.httpService.createPostRequest(URL,data).subscribe(response=>{
//            if(response.status){
//              this.getAddress();
//              }
//          });
//       }
//    }
// })
}
// Function to set Address as Default **********************************
  setAsDefaultAddress(address_id){
    let URL =  appConstant.baseUrl+'front/user/set_default_address';
    let data = {"lang":this.currentLanguageData['lng_code'],"lang_id":this.currentLanguageData['id'],"address_id":address_id,"user_id":this.user.id};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status){
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-success'], 
            timeout: 1000
          });
          setTimeout(()=>{this.getAddress()},1000);
         //  this.getAddress();
           }
       });
  }
}