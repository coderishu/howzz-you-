import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import {CartDetailService } from '../../provider/cartdetail';
import { StoreSetting } from '../../provider/app.store-setting';
import { GlobalData } from '../../provider/app.global';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import {PaymentInfoService } from '../../provider/paymentInfo';
import { NgProgress } from 'ngx-progressbar';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { FlashMessagesService } from 'ngx-flash-messages';
import {TranslateService} from '@ngx-translate/core';


declare var $:any;
declare var bootbox:any;

@(Component({selector:'ng-view',templateUrl:'./cart.html'}))

export class Cart implements OnInit {
  pinNo:number;
  baseUrl:string = appConstant['baseUrl'];
  meta : Meta;
  pinCodeData: any;
  globaldata:GlobalData;
  productId:any;
  cartArray:any=[];
  router:Router;
  isPinSubmit: boolean = false;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  cartdata:any=[];
  vendorId:any;
  defaultcurrency:any;
  imagepath:any;
  cartlength:any;
  user:any;
  userExist:boolean=false;
  addressDetail:any=[];
  emptyCart:boolean=true;
  basketResponseRecvd:boolean = false;
  errormsg:any;
  addressformData={};
  addressEditId:boolean =false;
  isFormSubmit:boolean = false;
  isFirst:boolean=true;
  grandTotal:any;
  applyCouponCodeFlag:boolean=false;
  couponCodeError:boolean=false;
  couponCodeSuccess:boolean=false;
  couponcodemsg:any;
  couponTransactionId:any;
  isApplyClicked:boolean = false;
  coupon:any={};
  iscouponclicked:boolean=false;
  productAvailabilityArr:any=[];
  storeData:any={};
  arrayColor:any={};
  currentLanguageData:any={};
  totalSaving:number=0;
  isDataAvailableInCart:boolean =false;
  refund_days:any;
  color:any = appConstant['color'];
  metaImagePath:any = appConstant['logoPath'];
  storeSettings:any;
  productAvailableMessage: string;
  isProductAvailable: boolean = false;

  constructor(private translateService:TranslateService,private flashMessagesService: FlashMessagesService,private urlBreadcrumbService:UrlBreadCrumbService,private ngProgress: NgProgress,private paymentinfoservice : PaymentInfoService,private languageTranslateInfoService:LanguageTranslateInfoService,private storesettingservice:StoreSetting,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,private title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.globaldata=globaldata;
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.meta = meta;
     //this.storesettingservice = storesettingservice;
     if(this.globaldata.isBrowser){
         if(localStorage.getItem('userLoginDetail')){
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
      
    }
     }
    
     
     /*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
        this.storeSettings = data;
        //alert(this.storeSettings.STORE.ORDER.delivery_price);
        this.storeData = data.STORE.seo;
        data['STORE']['breadcrum']['cart'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
        this.refund_days = data.STORE.ORDER.refund_days;

        //alert(this.refund_days);
         }
      });

   

    languageTranslateInfoService.translateInfo.subscribe((data) => {
      if(data){
                this.currentLanguageData = data;
                this.getCartDetail();
                
            }
      });
  }
  ngOnInit(){
   
   }
  
  loadEntity(){
   return '&#163';
  }
   //Function for getting basket(cart) details*************************
   getCartDetail(){
     this.totalSaving = 0;
     this.ngProgress.start();
    let browser_id;
    if(this.globaldata.isBrowser)
    browser_id = Cookie.get('browser_id');
    let URL =  this.baseUrl + "front/basket/get_basket_data";
    let data;
    if(this.userExist){
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],session_id:browser_id,user_id:this.user.id};
    }
    else{
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],session_id:browser_id};
    }
    
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      this.ngProgress.done();
      this.cartdetailservice.cartdatacount = response.data.cart_data.length;
      if(response.status){
        this.basketResponseRecvd = true;
       if(response.data.cart_data.length>0)
       this.emptyCart = false;
       else{
        this.emptyCart = true;
        this.errormsg = response.msg;
       }
       
        response.data.cart_data.map((product:any)=>{
          this.totalSaving += product.price - product.special_price;
        });
        
       // console.log(this.arrayColor);
        
        //*******************SET META TAGS********************************* */
        this.translateService.get('pageTitle.cart').subscribe((res)=>{
          //this.meta.updateTag({name:"title",content:res});
          this.title.setTitle(res);
          
        })
        this.meta.updateTag({name:"title",content:this.storeData.page_title?this.storeData.meta_key:''});
        this.meta.updateTag({name:"keywords",content:this.storeData.meta_key?this.storeData.meta_key:''});
        this.meta.updateTag({name:"description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"og:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"og:image",content:this.metaImagePath});
        this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});
      //******************************************************************* */
        this.cartdata = response.data;
        this.cartArray=response.data.cart_data;
        this.cartArray.forEach(element => {
          this.productId=element["product_id"]
          this.vendorId=element["vendor_id"]
        });
        this.grandTotal = this.cartdata.total_special_price;
        this.couponTransactionId = response.data.coupon_transaction_id;
       
        this.cartlength = response.data.cart_data.length;
        this.imagepath = response.data.thumb_path;
       }
      else{
        this.cartdata = [];
        this.errormsg = response.msg;
        this.emptyCart = true;
        this.basketResponseRecvd = false;
      }
    });
   }
  
   
//Function to show alert popup to Delete****************************
 removeProduct(cartID){
  this.deleteItem(cartID);
//   bootbox.confirm({ 
//     size: "small",
//     title: appConstant.title,
//     message: "Are you sure?", 
//     callback: (result)=>{ 
//      if(result)
//       this.deleteItem(cartID);
//   }
//  })
}


   //Function to delete product from cart******************************
  deleteItem(cartID){
  let URL =  appConstant.baseUrl+'front/basket/remove_cart';
    let data;
    if(this.userExist){
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],cart_id:cartID,user_id:this.user.id};
    }
    else{
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],cart_id:cartID};
    }
   this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
         this.getCartDetail();
        }
    });
 }

//Function to remove Coupon **********************************************
remove_coupon(transaction_id){
  let URL =  appConstant.baseUrl+'front/coupon/remove_coupon';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],transaction_id:transaction_id};
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
     alert(response['msg']);
      this.getCartDetail();
       
    }
  });

}

 // Function for increase quantity of product*******************************
increaseQuantity(val,cart_id,type){
      if(type == 'increase'){
        let data;
        if(this.userExist){
          data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:val+1,cart_id:cart_id,type:'quantity',user_id:this.user.id};
        }
        else{
          data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:val+1,cart_id:cart_id,type:'quantity'};
        }
        let URL =  appConstant.baseUrl+'front/basket/update_cart';
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
          if(response.status){
            this.getCartDetail();
           }
        });
       }
       else if(type == 'decrease'){
        let data;
       if(val>1){
          if(this.userExist){
            data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:val-1,cart_id:cart_id,type:'quantity',user_id:this.user.id};
          }
          else{
            data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:val-1,cart_id:cart_id,type:'quantity'};
          }
          let URL =  appConstant.baseUrl+'front/basket/update_cart';
         this.httpService.createPostRequest(URL,data).subscribe(response=>{
            if(response.status){
              this.getCartDetail();
              }
          });
        }
       
       }
       else{
         let value = $('#quantity').val();
         let data;
         if(value>=1){
            if(this.userExist){
              data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:value,cart_id:cart_id,user_id:this.user.id,type:'quantity'};
            }
            else{
              data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],quantity:value,cart_id:cart_id,type:'quantity'};
            }
            let URL =  appConstant.baseUrl+'front/basket/update_cart';
             this.httpService.createPostRequest(URL,data).subscribe(response=>{
              if(response.status){
                this.getCartDetail();
                }
            });
          }
         
       }
    }
     // show login form **************************************************
     showLoginPopUp(){
      //$(".login-panel").fadeIn("slow");
      this.globaldata.openPopUp(document.querySelector("#login"));
      if(this.applyCouponCodeFlag)
      this.cartdetailservice.URLtogo = '/cart';
      else
      alert('not login');
     // this.cartdetailservice.URLtogo = '/shipping-detail';
      }

     //Function for coupon code******************************************
     applyCouponCode(isValid){
       //this.iscouponclicked = true;
      this.isApplyClicked = !isValid;
      //alert(isValid);
      if(localStorage.getItem('userLoginDetail')==null){
         this.applyCouponCodeFlag = true;
         this.showLoginPopUp();
      }
      
      else if(!this.isApplyClicked){
        let user= JSON.parse(localStorage.getItem('userLoginDetail'));
        let URL =  appConstant.baseUrl+'front/coupon/get_coupon';
        let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:user.id,price:this.grandTotal,coupon_code:this.coupon.couponcode,transaction_id:this.couponTransactionId}
        // console.log(data);
        // let encrypt_data = this.encryptionservice.encrypt_data(data);
        this.httpService.createPostRequest(URL,data).subscribe(response=>{
          if(response.status){
            this.couponCodeSuccess = true;
            this.couponCodeError = false;
            this.couponcodemsg = response.message;
            this.getCartDetail();
            
          }
          else{
            this.couponCodeError = true;
            this.couponCodeSuccess = false;
            this.couponcodemsg = response.message;
          }
          
        });
            setTimeout(() => {
             this.couponCodeError = false;
            }, 3000);
        }
      
     }
  //Function to move wishlist***********************
  moveToWishlist(cartData){
    
      

    if(!this.user){
      this.flashMessagesService.show("You are not Logged In!!!!", {
        classes: ['alert', 'alert-danger'], 
        timeout: 500000
      });
      // this.globaldata.openPopUp(document.querySelector("#login"));
       
      //  return false;
    }
    else{
      let product_id = cartData.product_id;
      let sku = cartData.sku;
      let cart_id = cartData.cart_id;
      let url_data = cartData.urldata;
     //console.log(JSON.stringify(this.user));
      let URL =  appConstant.baseUrl+'front/basket/move_to_wish_list';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id,
                  product_id:product_id,sku:sku,cart_id:cart_id,urldata:url_data};
      // let encrypt_data = this.encryptionservice.encrypt_data(data);
       this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-success'], 
            timeout: 1000
          });
         //alert(response['msg']);
          this.getCartDetail();
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

  
     //Function to make URL***********************************************
     makeURL(urlData,qyeryParams){
      this.router.navigate(urlData,{queryParams:qyeryParams});
     }

   //Function to show login form******************************************
   navigateToCheckout(){
      localStorage.setItem('paymentAcess','true');
    //localStorage.removeItem("isGift");
   if(localStorage.getItem('userLoginDetail')){
     this.paymentinfoservice.displaySection =appConstant['ADDRESS'];
     this.router.navigate(['/checkout']);
   }
else{
  // //$("#login").show("slow");
  //   this.paymentinfoservice.displaySection =appConstant['SHIPPING'];
     this.router.navigate(['/checkout-login']);
}
  
 }

  hideErrorMessage(){
        
      if(!this.pinNo){
          this.productAvailableMessage = '';
          this.isPinSubmit = false;
      }
       
    }
 // Function to check zipcode***********************************
 checkPincode(status: boolean) 
 {
  this.isPinSubmit = true;
  if (!status)
      return
  let url = this.baseUrl + "front/webservice/check_zip_code";
  let browser_id;
  if(this.globaldata.isBrowser)
  browser_id = Cookie.get('browser_id');
  // let vender_id = this.cartArray[0]["vendor_id"];
  // alert(vender_id)
  let data = { "product_id": this.productId, "vendor_id": this.vendorId, "browser_id": browser_id, "zipcode": this.pinNo, "lang_id": this.currentLanguageData['id'], "lang": this.currentLanguageData['lng_code'] }
  this.httpService.createPostRequest(url, data).subscribe((response: any) => {
     this.productAvailableMessage = response['msg'];
      this.isProductAvailable = response['status'];
      if (response['status'] == true) {
          if(this.globaldata.isBrowser)
         localStorage.setItem("pinNo", this.pinNo.toString());
          this.pinCodeData = response['data'];
      }
     
  });

}
}