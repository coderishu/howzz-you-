import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import {CartDetailService } from '../../provider/cartdetail';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { GlobalData } from '../../provider/app.global';
import { StoreSetting } from '../../provider/app.store-setting';
import { NgProgress } from 'ngx-progressbar';
import {saveAs as importedSaveAs} from 'file-saver';

//import {saveAs as importedSaveAs} from 'file-saver';
declare var $:any;

@(Component({selector:'ng-view',templateUrl:'./checkoutLogin.html'}))

export class CheckoutLogin implements OnInit {
  meta : Meta;
  globaldata:GlobalData;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  color:any = appConstant['color'];
  user:any;
  //userExist:boolean=false;
  reviewData:any=[];
  image_path:any;
  starcount:any;
  order_id:any;
  oid:any='';
  productData:any = {};
  defaultcurrency:any;
  cancelled_status:any;
  refund_status:any = 0;
  productID:any;
  trackOrderDetail:any;
  currencyJSON:any;
  storeSystemData:any = {};
  storeData:any = {};
  userComment:string = ''
 // userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
  currentLanguageData:any={};
  isRtl:boolean=false;
  trackOrder:any = {};
  isFormSubmit:boolean = false;
  isOrderDetail:boolean = false;
  baseUrl:string = appConstant['baseUrl'];
  loginUser:any = {};
  cartdata:any;
  basketResponseRecvd:boolean = false;
  imagepath:any;

  constructor(private ngProgress: NgProgress,private languagetranslateinfoservice:LanguageTranslateInfoService,private storesettingservice:StoreSetting,globaldata:GlobalData,cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,title:Title,meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     this.router = router;
     this.route = route;
     this.storesettingservice = storesettingservice;
     this.globaldata=globaldata;
     this.httpService = httpService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
    
     //this.starcount = appConstant.starCount;
     this.meta = meta;
    
    //  this.route.params.subscribe(params=>{
    //    this.order_id = params['order_id'];
    //    this.oid = params['oid'];
    //  });

   

  //   if(localStorage.getItem('userLoginDetail')){
  //     this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
  //   }
  //  //Getting Store info************************************
  //     storesettingservice.apiSettingsData.subscribe((data) => {
  //     if(data){
  //        this.storeSystemData = data.SYSTEM;
  //        this.storeData = data.STORE.seo;
  //        //*******************SET META TAGS********************************* */
  //       this.meta.updateTag({name:"title",content:this.storeData.page_title});
  //       this.meta.updateTag({name:"keywords",content:this.storeData.meta_key});
  //       this.meta.updateTag({name:"description",content:this.storeData.meta_desc});
  //       this.meta.updateTag({name:"og:title",content:this.storeData.page_title});
  //      // this.meta.updateTag({name:"og:image",content:cat_basic_path+catInfo.category_image});
  //       this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc});
  //       this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title});
  //       this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc});
  //      // this.meta.updateTag({name:"twitter:image",content:this.storeData.page_title});
  //        }
  //     });

      languagetranslateinfoservice.translateInfo.subscribe((data) => {
        if(data)
        {
            this.currentLanguageData = data;
            if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
                this.isRtl = true;
            }
            else
            this.isRtl = false;
           this.getCartDetail();
            
         }
        });
  }
  ngOnInit(){
   // $("#track-order").show("slow");
  
  }

 
   /****************************************************************** 
   //Function for getting basket(cart) details*************************
   ********************************************************************/
   getCartDetail(){
   this.ngProgress.start();
   let browser_id;
   if(this.globaldata.isBrowser)
   browser_id = Cookie.get('browser_id');
   let URL =  this.baseUrl + "front/basket/get_basket_data";
   let data;
   
     data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],session_id:browser_id};
   
   
   this.httpService.createPostRequest(URL,data).subscribe(response=>{
     this.ngProgress.done();
     if(response.status){
       this.basketResponseRecvd = true;
      if(response.data.cart_data.length>0){
         this.cartdata = response.data;
         //alert(this.cartdata.cart_data.length);
         //console.log(this.cartdata.cart_data.length);
         }
      }
     else{
       this.cartdata = [];
      }
   });
  }
  /************************************************************************* 
  // Function to validate Login ********************************************
  **************************************************************************/
  validateLogin(isValid: boolean)
  {
   this.isFormSubmit = true;
   if (!isValid)
     return
     this.ngProgress.start();
   this.loginUser['type'] = 'normal';
  //  if(this.loginUser.isRemember)
  //  {
  //    Cookie.set('email',this.loginUser.email);
  //    Cookie.set('password',this.loginUser.password);
  //    Cookie.set('isRemember',this.loginUser.isRemember);
  //  }
  //  else{
  //    Cookie.set('email',"");
  //    Cookie.set('password',"");
  //    Cookie.set('isRemember',"");
  //  }
   this.login(this.loginUser);   
  
   
 }
 /**************************************************************************** 
  // Function to do Login ****************************************************
  ***************************************************************************/
 login(userData:any){

   userData['lang'] = this.currentLanguageData['lng_code'];
   userData['lang_id'] = this.currentLanguageData['id'];  
   let url = this.baseUrl + "front/user/login";
  this.httpService.createPostRequest(url, userData).subscribe((response: any) => { 
   this.ngProgress.done();
     if(response['status'] == true)
     {
      //this.msgStatus= true;
     //  this.title = response['msg'];
    //    setTimeout(()=>{
    //        window.location.reload();
    //  },500)
      
       let decriptData = response['data'];
       localStorage.setItem("userLoginDetail",JSON.stringify(decriptData));
     
       this.globaldata.addToWishListInLocalStorage(response['data']['wishlist_detail']);
      
       /**************************UPDATE CART******************************************/
       let browser_id = Cookie.get('browser_id');
       let URLtosend =  this.baseUrl+'front/basket/update_cart';
       let dataTOsend = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],user_id:response.data.id,session_id:browser_id};
       this.httpService.createPostRequest(URLtosend,dataTOsend).subscribe(data=>{
           if(data.status){
           
               this.cartdetailservice.userExist = true;
              
               this.isFormSubmit = false;
               this.loginUser = {};
               this.router.navigate(["/checkout"]);
            
           }
          
      
       });
        /*********************************************************************/
     }
     else{
      // this.msgStatus= false;
       // this.modelAlertOb.openPopup(response['msg']);
       //this.title=response['msg']
       this.loginUser = {};
       this.isFormSubmit = false;
       }
     
  });
 }
   
}