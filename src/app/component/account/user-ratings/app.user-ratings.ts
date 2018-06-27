import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
// import {EncryptionService } from '../../provider/encryption';
import { GlobalData } from '../../../provider/app.global';
import { FlashMessagesService } from 'ngx-flash-messages';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../../provider/app.store-setting';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-ratings.html'}))

export class UserRatings implements OnInit {
 
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  // encryptionservice:EncryptionService;
  user:any;
  userExist:boolean=false;
  wishlistData:any=[];
  image_path:any;
  defaultcurrency:any;
  errorMsg:any;
  currencyJSON:any={};
  ratingData:any=[];
  review:any={};
  ratingIds:any=[];
  currentProId:any;
  error_msg:any;
  ratingStarCount:any;
  productInfo:any;
  image_url:any;
  isFormSubmit:any;
  url_data:any;
  storeData:any={};
  currentLanguageData:any={};
  isRtl:boolean=false;
  metaImagePath:any = appConstant['logoPath'];



  constructor(private title:Title,private translateService:TranslateService,private globalDataService:GlobalData,private storesettingservice:StoreSetting,private urlBreadCrumbService:UrlBreadCrumbService,private flashMessagesService: FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,private meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService)
  {

    this.translateService.get("pageTitle.account.rating").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     this.router = router;
     this.route = route;
     this.httpService = httpService;
    currencyconvertservice;
     //alert(this.currencyconvertservice.currentcurrencycode);
     this.cartdetailservice=cartdetailservice;
    //  this.encryptionservice = encryptionservice;

    this.route.params.subscribe(params => {
      this.currentProId = params['product_id'];
   }); 

     languageTranslateService.translateInfo.subscribe((data) => {
      
      if(data){
        if(this.globalDataService.isBrowser){
            if(localStorage.getItem('userLoginDetail')){
          this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
          this.url_data = JSON.parse(localStorage.getItem('productURL'));
          this.userExist=true;
        }
        }
      
      this.currentLanguageData = data;
      if(this.currentLanguageData['lng_code'] == appConstant['rtl'])
      {
          this.isRtl = true;
      }
      else
      this.isRtl = false;
      // this.getAddress();
      this.getRating();
      this.product_detail();
  
      }
   });

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
  //Function to store rate star*****************************
  rateProduct(item:any){
    this.ratingStarCount = item;
    for(let g=0;g<this.ratingIds.length;g++){
      if(this.ratingIds[g].id ==this.ratingStarCount.id){
          this.ratingIds[g].rate = this.ratingStarCount.rating;
        }
      }
     // console.log(this.ratingIds);
   }
   

  //Function to get All Ratings******************************
  getRating(){
        let URL =  appConstant.baseUrl+'front/review/all_rating';
        let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
        // let encrypt_data = this.encryptionservice.encrypt_data(data);
         this.httpService.createPostRequest(URL,data).subscribe(response=>{
           if(response.status){
            this.ratingData = response.data;
             for(let d=0;d<response.data.length;d++){
                 let data = {id:this.ratingData[d]._id,
                              rate:0
                            };
                 this.ratingIds.push(data);
              }
             }
         });
     }

 
   //Function to add review data****************************
   add_review(isvalid){
     this.isFormSubmit = !isvalid;
     if(!this.isFormSubmit){
      let URL =  appConstant.baseUrl+'front/review/add_review';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:this.currentProId,
                  detail_rating:this.ratingIds,title:this.review['title'],review_data:this.review['review_data'],user_id:this.user.id,url_data:this.url_data};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status){
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-success'], 
            timeout: 1000,
          });
           this.review={};
           setTimeout(()=>{this.router.navigate(['/account/review']),2000});
           ;
           }
           else{
            this.flashMessagesService.show(response['msg'], {
                classes: ['alert', 'alert-danger'], 
                timeout: 1000, 
              });
        }
       });
      }
   }

   //Function to get product details********************
   product_detail(){
     let URL =  appConstant.baseUrl+'front/review/get_product_detail';
     let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:this.currentProId};
    //  let encrypt_data = this.encryptionservice.encrypt_data(data);
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
          this.url_data = this.urlBreadCrumbService.getUrl(response.data,{});
          this.productInfo = response.data;
          this.image_url = response.urls.thumb_path;
         }
         
      });
   }

   //Function to make URL***********************************************
   makeURL(urlData,qyeryParams){
    this.router.navigate(urlData,{queryParams:qyeryParams});
   }
}