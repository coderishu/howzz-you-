import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { GlobalData } from '../../../provider/app.global';
import {UrlBreadCrumbService} from '../../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../../provider/app.store-setting';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-editaddress.html'}))

export class UserEditAddress implements OnInit {
  color:any = appConstant['color'];
  baseUrl:string = appConstant['baseUrl'];
  meta:Meta;
  storesettingservice:StoreSetting;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  user:any;
  userExist:boolean=false;
  addressDetail:any=[]; 
  isFormSubmit:boolean = false;
  addressformData:any={};
  countryData:any = [];
  countrySelected:boolean=false;
  stateData:any=[];
  currentAddressId : any;
  default_adress:any;
  storeData:any={}; 
  currentLanguageData:any={};
  isLoadFirst:boolean = true;
  metaImagePath:any = appConstant['logoPath'];

  constructor(private title:Title,private translateService:TranslateService,private urlBreadCrumbService:UrlBreadCrumbService,private ngProgress: NgProgress,private flashMessagesService : FlashMessagesService,private languageTranslateInfoService:LanguageTranslateInfoService,storesettingservice:StoreSetting,private globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.translateService.get("pageTitle.account.editAddress").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.globaldata  = globaldata;
     this.meta = meta;
     this.storesettingservice=storesettingservice;
    

     
     this.route.params.subscribe(params => {
      this.currentAddressId = params['address_id'];
   }); 

   languageTranslateInfoService.translateInfo.subscribe((data) => {
    if(data){
             this.currentLanguageData = data;
             this.geAddressbyID();
             this.getCountryList();
           }
   });
    /*for getting store setting data************************/
    storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
         this.storeData = data.STORE.seo;
         this.meta.updateTag({name:"title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"keywords",content:this.storeData.meta_key?this.storeData.meta_key:''});
        this.meta.updateTag({name:"description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"og:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"og:image",content:this.metaImagePath});
        this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
       this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});

       data['STORE']['breadcrum']['account'] == "1"?this.urlBreadCrumbService.toggleBreadCrumb(true):this.urlBreadCrumbService.toggleBreadCrumb(false);
         }
      });
    if(this.globaldata.isBrowser){
       if(localStorage.getItem('userLoginDetail')){
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
    }
    }
   
  
  }
  ngOnInit(){
   
  }
  loadEntity(){
   return '&#163';
  }

  // Function to set default Address*************************
  defaultAddress(default_add){
    this.default_adress = default_add;
    //alert(this.default_adress);
 }
  //Function to add Address**********************************
  editAddress(isValid)
  {
    this.isFormSubmit = !isValid;
    if(!this.isFormSubmit){
     
      let URL =  this.baseUrl+'front/user/update_address';
      this.addressformData['landmark'] = this.addressformData['land_mark'];
      delete this.addressformData["land_mark"]; 
      this.addressformData['lang']= this.currentLanguageData['lng_code'];
      this.addressformData['lang_id']= this.currentLanguageData['id'];
      this.addressformData['user_id']= this.user.id;
     this.httpService.createPostRequest(URL,this.addressformData).subscribe(response=>{
      this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/editaddress']);
        if(response.status){
         this.addressformData ={};
         this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-success'], 
          timeout: 1000
        });
       
         setTimeout(()=>{this.router.navigate(['/account/addresses'])},1000);
        }
      });
    }
  }

   //function to edit address form data******************************
   geAddressbyID(){
    this.ngProgress.start();
    let URL =  this.baseUrl+'front/user/get_address_by_id';
    let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],address_id:this.currentAddressId};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/editaddress']);
      this.ngProgress.done();
       if(response.status){
         this.addressformData = response.data;
         if(this.isLoadFirst)
         this.getStateList(response.data.country);
       }
     });
    }

  //Function to get country list*****************************
  getCountryList(){
    let URL =  this.baseUrl+'front/webservice/country_list';
    let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code']};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/editaddress']);
       if(response.status){
         this.countryData = response.data;
         }
     });
   }
    //Function  for get State of any country********************
    getStateList(event){
      if(!this.isLoadFirst)
      this.addressformData['state'] = '';
      let country_id;
      this.countrySelected = true;

      if(event instanceof Object)
      country_id = event.target.value;
      else
      country_id = event;
     // country_id = event.target.value;
     let URL =  this.baseUrl+'front/webservice/state_list';
     let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],id:country_id.toString()};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb']['/account/editaddress']);
        if(response.status){
          this.stateData = response.data;
          this.isLoadFirst = false;
         }
      });
    }
}