import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
//import {EncryptionService } from '../../provider/encryption';
import { GlobalData } from '../../../provider/app.global';
import { FlashMessagesService } from 'ngx-flash-messages';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./user-edit-rating.html'}))

export class UserEditRating implements OnInit {
  globaldata : GlobalData;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  //encryptionservice:EncryptionService;
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
  currentreviewId:any;
  ratingdetail:any=[];
  ratingStarCount:any;
  currentProductId:any;
  productInfo:any;
  image_url:any;
  isFormSubmit:boolean=false;
  currentLanguageData:any={};
  isRtl:boolean = false;
  //review:any=[];
  constructor(private title:Title,private translateService:TranslateService,private flashMessagesService: FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService, globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.translateService.get("pageTitle.account.editRating").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.globaldata = globaldata;
     this.currencyconvertservice = currencyconvertservice;
     //alert(this.currencyconvertservice.currentcurrencycode);
     this.cartdetailservice=cartdetailservice;
    // this.encryptionservice = encryptionservice;
    
     this.route.params.subscribe(params => {
      this.currentreviewId = params['review_id'];
   }); 

   languageTranslateService.translateInfo.subscribe((data) => {
      
    if(data){
      if(this.globaldata.isBrowser){
         if(localStorage.getItem('userLoginDetail')){
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
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
    this.getRatingById();

    }
});

     
  }
  ngOnInit(){
    //this.getRatingById();
   
  }
  rateProduct(item:any){
   
   this.ratingStarCount = item;
   for(let g=0;g<this.ratingIds.length;g++){
     if(this.ratingIds[g].id ==this.ratingStarCount.id){
         this.ratingIds[g].rate = this.ratingStarCount.rating;
       }
     }
   }
  loadEntity(){
   return '&#163';
  }
   //Function to get All Ratings************************************
   getRating(){
    let URL =  appConstant.baseUrl+'front/review/all_rating';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
   
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
        // this.star_count = appConstant.starCount;
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
  //Function to get All Ratings************************************
  getRatingById(){
        let URL =  appConstant.baseUrl+'front/review/edit_detail';
        let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],review_id:this.currentreviewId};
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
           if(response.status){
             this.ratingdetail = response.data;
             this.currentProductId = response.data.product_id.id;
             this.review.review_data = response.data.review;
             this.review.title =  response.data.title;
             for(let d=0;d<response.data.detail_rating.length;d++){ 
              let data = {id:response.data.detail_rating[d]._id,
                           rate:response.data.detail_rating[d].rating
                         };
              this.ratingIds.push(data);
             }
            }
            //API to get product details
            let URL =  appConstant.baseUrl+'front/review/get_product_detail';
            let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:this.currentProductId };
           this.httpService.createPostRequest(URL,data).subscribe(response=>{
               if(response.status){
                 this.productInfo = response.data;
                 this.image_url = response.urls.thumb_path;
                 //alert(this.image_url);
                 }
                
             });
         });
     }
 //Function to update rating details *******************************
 edit_review(isValid){
  this.isFormSubmit = !isValid;
  if(!this.isFormSubmit){
  let URL =  appConstant.baseUrl+'front/review/edit_review';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],
              detail_rating:this.ratingIds,title:this.review['title'],review_data:this.review['review_data'],user_id:this.user.id,review_id:this.currentreviewId};
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
     if(response.status){
      this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-success'], 
        timeout: 1000,
      });
     //  this.globaldata.showToaster({type:'success',body:response.msg});
       setTimeout(()=>{this.router.navigate(['/user-review']),2000});
       //this.review={};
       //this.router.navigate(['/user-review']);
       }
   });
  }
 }

 //Function to make URL***********************************************
 makeURL(urlData,qyeryParams){
  this.router.navigate(urlData,{queryParams:qyeryParams});
 }
 
}