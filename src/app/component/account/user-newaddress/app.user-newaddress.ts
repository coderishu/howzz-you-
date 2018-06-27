import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { FlashMessagesService } from 'ngx-flash-messages';
import { GlobalData } from '../../../provider/app.global';
import { StoreSetting } from '../../../provider/app.store-setting';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-newaddress.html'}))

export class UserNewAddress implements OnInit {
  
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  meta:Meta;
  user:any;
  userExist:boolean=false;
  addressDetail:any=[]; 
  isFormSubmit:boolean = false;
  addressformData:any={'country':'','state':''};
  countryData:any = [];
  countrySelected:boolean=false;
  stateData:any=[];
  default_adress:any;
  currentLanguageData:any={};
  isRtl:boolean=false;
  isloadingFirst:boolean = true;
  storeData:any;
  metaImagePath:any = appConstant['logoPath'];
 
 
  constructor(private title:Title,private translateService:TranslateService,private storesettingservice:StoreSetting,private flashMessagesService : FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,private globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     
      this.translateService.get("pageTitle.account.newAddress").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.languageTranslateService=languageTranslateService;
     this.meta =meta;
     
     this.globaldata  = globaldata;
    
    languageTranslateService.translateInfo.subscribe((data) => {
      
      if(data)
       {   if(this.globaldata.isBrowser){
        if(localStorage.getItem('userLoginDetail')){
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
          this.getCountryList();
  
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

  // Function to set default Address*************************
  defaultAddress(default_add){
     this.default_adress = default_add;
    // alert(this.default_adress);
  }
  //Function to add Address**********************************
  addAddress(isValid)
  {
    this.isFormSubmit = !isValid;
    //console.log(this.addressformData);
    if(!this.isFormSubmit){
      let URL =  appConstant.baseUrl+'front/user/add_address';
      this.addressformData['lang']= this.currentLanguageData['lng_code'];
      this.addressformData['lang_id']= this.currentLanguageData['id'];
      this.addressformData['user_id']= this.user.id;
      this.addressformData['default']= this.default_adress;
      this.httpService.createPostRequest(URL,this.addressformData).subscribe(response=>{
        if(response.status){
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-success'], // You can pass as many classes as you need
            timeout: 1000, // Default is 3000
          });
          setTimeout(()=>{ this.router.navigate(['/account/addresses'])},1000);
           this.addressformData ={};
          }
      });
    }
  }

  //Function to get country list*****************************
  getCountryList(){
    let URL =  appConstant.baseUrl+'front/webservice/country_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
    // let encrypt_data = this.encryptionservice.encrypt_data(data);
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
         this.countryData = response.data;
         }
     });
   }
    //Function  for get State of any country********************
    getStateList(event){
      this.countrySelected = true;
     let country_id = event.target.value;
     if(!this.isloadingFirst)
     this.addressformData.state = '';
     let URL =  appConstant.baseUrl+'front/webservice/state_list';
     let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],id:country_id};
    //  let encrypt_data = this.encryptionservice.encrypt_data(data);
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
          this.stateData = response.data;
          this.isloadingFirst = false;
         }
      });
    }
}