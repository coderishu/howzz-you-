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
import { StoreSetting } from '../../../provider/app.store-setting';
import {UserInfoService } from '../../../provider/userInfo';
import { FlashMessagesService } from 'ngx-flash-messages';
import {TranslateService} from '@ngx-translate/core';

import { NgProgress } from 'ngx-progressbar';
declare var $:any;
declare var bootbox:any;

@(Component({selector:'ng-view',templateUrl:'./user-wishlist.html'}))

export class UserWishlist implements OnInit {
  color:any = appConstant['color'];
  globaldata : GlobalData;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  meta:Meta;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  storesettingservice:StoreSetting;
  user:any;
  userExist:boolean=false;
  wishlistData:any=[];
  wishlistsData:Array<any> = [];
  image_path:any;
  defaultcurrency:any;
  currencyJSON:any={};
  storeData:any={};
  currentLanguageData:any={};
  isRtl:boolean=false;
  isWishDataNotAvailable:boolean=false;
  metaImagePath:any = appConstant['logoPath'];
  typeofAddToCartfromDetail = appConstant['typeofAddToCartfromDetail'];
  sortWishlistModel:string = '';
  sortwishLists:string = '';
 
  constructor(private title:Title,private translateService:TranslateService,public globalDataService:GlobalData,private ngProgress: NgProgress,private flashMessagesService:FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,private userinfoservice:UserInfoService,storesettingservice:StoreSetting,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
    
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.wishlist").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    },1000);
   
     
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.languageTranslateService=languageTranslateService;
     this.globaldata = globaldata;
     this.currencyconvertservice = currencyconvertservice;
     this.storesettingservice=storesettingservice;
     this.cartdetailservice=cartdetailservice;
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
      this.getWishList();
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
           }
        });

   }
   sortwishList(){
     //this.sortwishLists = this.sortWishlistModel;
     this.wishlistData = [];
      if(this.sortWishlistModel != ''){
        
         this.wishlistsData.map((item)=>{
              if(item.product_id.name.name.toLowerCase().indexOf(this.sortWishlistModel) > -1){
                this.wishlistData.push(item);
              }
         })  
        //return product.product_id.name.name.toLowerCase().indexOf(type) > -1;
        //else if()
       }
       else
       this.wishlistData = this.wishlistsData; 

    
   }
  ngOnInit(){
 
  }
  loadEntity(){
   return '&#163';
  }
  
  //Function to get data of wishlist**********************
  getWishList(){
    this.ngProgress.start();
    let URL =  appConstant.baseUrl+'front/order/all_wish_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.ngProgress.done();
      if(response.status && response.data.length > 0){
        this.isWishDataNotAvailable = false;
         this.wishlistData = response.data;
         this.wishlistsData = response.data;
         this.userinfoservice.userWishlistCount = response.data.length;
         this.image_path = response.urls.thumb_path;
        }
        else this.isWishDataNotAvailable= true;
        
     });
  }
  //Function to show alert popup to Delete****************************
  removeWishListData(sku,productId){
    if(confirm("Are you sure want to delete?")){
      this.removeFromWishList(sku,productId);
    }
  //  bootbox.confirm({ 
  //     size: "small",
  //     title: appConstant.title,
  //     message: "Are you sure?", 
  //     callback: (result)=>{ 
  //     if(result)
  //       this.removeFromWishList(sku,productId);
  //     }
  //    });
  }
  // Function to remove a product from wishList *****************************
  removeFromWishList(sku,productId){
    let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
    let URL =  appConstant.baseUrl+'front/order/remove_to_wish_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],sku:sku,product_id:productId,user_id:userDetail.id};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
        this.globalDataService.addToWishListInLocalStorage(response['wishlist_detail']);
         //alert(response['msg']);
         this.getWishList();
         }
         else{
        // alert(response['msg']);
         }
     });
  }
  //Functio to add a product to cart************************************
addToCart(sku,associate,event,product_id,vendor_id,currencycode,quantity,urldata)
{
  //let currencyID = this.currencyJSON[currencycode].id;
  let currencyID = this.currencyconvertservice.currentCurrencyData['id'];
  let URL =  appConstant.baseUrl+'front/basket/add_to_cart';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"type" :this.typeofAddToCartfromDetail,"product_id":product_id,"vendor_id":vendor_id,"currency_id":currencyID,"quantity":quantity,"shipping_id":'',"user_id":this.user.id,"sku":sku,"associate":associate,"urldata":urldata};
 // console.log(JSON.stringify(data));
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
      this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-success'], 
        timeout: 1000
      });
     setTimeout(()=>{this.router.navigate(["/cart"])},1000) ;
    }
    else{
      this.flashMessagesService.show(response['msg'], {
        classes: ['alert', 'alert-danger'], 
        timeout: 1000
      });
    }
 
      
   });

 }

 //Function to make URL***********************************************
 makeURL(urlData,qyeryParams){
  this.router.navigate(urlData,{queryParams:qyeryParams});
 }

 /******************************************************************* 
 // Function to navigate user by selecting option drop down************
 **********************************************************************/
 navigateToOptionChange(event,product)
 {
  // if(event.target.value=='cancel'){
  // this.isCancelPopupOpen = true;
  // this.showCancelPopup(product,product.oid);
   
  // }
  // else if(event.target.value=='refund'){
  //   this.isRefundPopupOpen = true;
  //   setTimeout(()=>{ $('#refund-popup').modal('show');},500);
  //   this.showRefundPopup(product);
     
  //   }
    if(event.target.value=='viewdetail'){
     // alert();
     // console.log(JSON.stringify(product.url_data.urlData));
    this.router.navigate(product.url_data.urlData);
   }

  }
}