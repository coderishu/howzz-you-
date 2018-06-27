import {Component,OnInit,ViewChild,Output,EventEmitter} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { StoreSetting } from '../../provider/app.store-setting';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { NgProgress } from 'ngx-progressbar';
declare var $:any;
import { GlobalData } from '../../provider/app.global';
import {TranslateService} from '@ngx-translate/core';
@(Component({selector:'ng-view',templateUrl:'./order-confirmation.html'}))

export class OrderConfirmation implements OnInit 
{
  currentLanguageData:any={};
  user:{};
  userExist:boolean=false;
  orderDetailInfo:any=[];
  imagepath:any;
  orderCancelData:any={};
  hidecancellabel:boolean=true;
  orderAddress:any;
  orderData:any=[];
  color:any = appConstant['color'];
  baseUrl:string = appConstant['baseUrl'];
  isRtl:boolean=false;
  isCancelPopupOpen:boolean=false;
  productData:any;
  odid:any={};
  storeData:any={};
  cancelProduct:any={};
  all_reason:any;
  pageNoMostPopular:number = 1;
  mostProductData:any = {};
  isMostPopularProductsAreAvailable:boolean = false;
  mostPopularProducts:any=[];
  image_path:any;
  isFirst:boolean=true;
  typeOfCart =  localStorage.getItem("isGift")?localStorage.getItem("isGift"):undefined;
  metaImagePath:any = appConstant['logoPath'];
  slideIndex:number = 0;
  @ViewChild('mostPopularViewChild') mostPopularViewChild:any;
  constructor(private translateService:TranslateService,private title:Title,private globalDataService:GlobalData,private ngProgress:NgProgress,private urlBreadcrumbService:UrlBreadCrumbService,private router:Router,private currencyconvertservice:CurrencyConvertService,private meta:Meta,private storesettingservice:StoreSetting,private httpService:HttpService,private languageTranslateInfoService:LanguageTranslateInfoService)
  {
     this.translateService.get("pageTitle.orderConfirm").subscribe((res)=>{
				this.title.setTitle(res);
			 });
     if(this.globalDataService.isBrowser)
     {
      localStorage.removeItem('isGift');
      localStorage.removeItem('paymentAcess');
      localStorage.removeItem('paymentMode');
      localStorage.removeItem('isAddresschecked');
    
    if(localStorage.getItem('userLoginDetail'))
    {
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userExist=true;
    }
     } 
  languageTranslateInfoService.translateInfo.subscribe((data) => {
      if(data)
     {
        this.currentLanguageData = data;
        if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
          
          this.isRtl = true;
      }
      else
      this.isRtl = false;

      if(!this.isFirst)
      this.mostPopularProductDetails();
       this.orderDetails();
        }
    });

     
     /*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
        this.storeData = data;
        if(this.isFirst)
          this.mostPopularProductDetails();
         }
      });
   }

  ngOnInit()
  {
 
  }
  ngAfterViewInit()
  {
    if(this.globalDataService.isBrowser)
    $("body,html").animate({scrollTop:0},400);
  }
 
hideCancelPopup(data)
{
  this.isCancelPopupOpen = false;
  this.hidecancellabel = !this.hidecancellabel;
  // if(data.status)
  // this.orderDetails();
}

showCancelPopup(rowindex)
 {
   this.orderCancelData=this.orderDetailInfo.order_data[rowindex];
  //  this.hidecancellabel=false;
  this.isCancelPopupOpen = true;
  this.odid = this.odid;
  let URL =  appConstant.baseUrl+'front/order/all_reason';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    // this.hidecancellabel=!this.hidecancellabel;
    if(response.status)
    {
     this.all_reason = response.data;
     }
  });
}



 //Function for getting order detail info*******************
 orderDetails(){
  this.ngProgress.start();
  let URL =  this.baseUrl+'front/order/get_order_detail';
  let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],user_id:this.user['id'],type:this.typeOfCart}
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    this.ngProgress.done();
    if(response.status){
      let metadata = this.storeData.STORE['seo'];
      // console.log("metadata"+JSON.stringify(metadata));
      this.meta.updateTag({name:"title",content:metadata.page_title?metadata.page_title:''});
      this.meta.updateTag({name:"keywords",content:metadata.meta_key?metadata.meta_key:''});
      this.meta.updateTag({name:"description",content:metadata.meta_desc?metadata.meta_desc:''});
      this.meta.updateTag({name:"og:title",content:metadata.page_title?metadata.page_title:''});
      this.meta.updateTag({name:"og:description",content:metadata.meta_desc?metadata.meta_desc:''});
      this.meta.updateTag({name:"og:image",content:this.metaImagePath});
      this.meta.updateTag({name:"twitter:title",content:metadata.page_title?metadata.page_title:''});
      this.meta.updateTag({name:"twitter:description",content:metadata.meta_desc?metadata.meta_desc:''});
      this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});


      this.orderDetailInfo = response.data;
      this.orderData=this.orderDetailInfo.order_data
      // console.log(this.orderData.image)
      this.orderData.forEach(element => {
        this.odid = element.order_detail_id;
      });
      // console.log(JSON.stringify(this.orderData));
      this.imagepath = response.data.thumb_path;
      // console.log(this.imagepath);
      this.orderAddress = response.data.address_detail;
     }
  });

 }

 //Function to make URL***********************************************
 makeURL(urlData,qyeryParams){
 this.router.navigate(urlData,{queryParams:qyeryParams});
}

//Function to get url of product**************************************
getDetailUrl(productItem:any){
  let urlData:Object = {};
  let productDetailUrl:Array<any> = [];
  let productName  = productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name'];
  let productId = productItem['_id'];
  //console.log(JSON.stringify(productItem['parent_detail_data']));
  productItem['parent_detail_data'].map((item,index)=>{
    index == 0?productDetailUrl.push("/"+item['name']):productDetailUrl.push(item['name']);
  });
 //  productDetailUrl.push(productName.replace(/(|)/g, ""));
   productDetailUrl.push(productName.replace(/\(|\)/g, ""));
   
//console.log("length=="+productDetailUrl.length);
     for(let i = productDetailUrl.length;i<6;i++)
     productDetailUrl.push(productId);
     urlData['url'] = productDetailUrl;
     urlData['params'] = {id:productId,sku:productItem['sku'],ass:productItem['associate']};
    //  alert("urlData");
    // console.log(JSON.stringify(urlData));
   return urlData;
}
// getUrl(productItem:any){
  
//    // console.log(JSON.stringify(productItem));
//        let  productId = productItem['_id'];
//        let productName = productItem['translation_data'][0]['name'] != ''?productItem['translation_data'][0]['name']:productItem['name']['name'];
//        let urlData:Array<any> = this.urlBreadcrumbService.getUrl(productItem,6);
//       // alert("urlData");
//         console.log(urlData);
//       let urlDataWithParams = {}; 
//          urlDataWithParams['url'] = urlData;
//          urlDataWithParams['params'] = {id:productItem['_id'],sku:productItem['sku'],ass:productItem['associate'] };
        
//          return  urlDataWithParams;
   
       
//    }

//Function for getting Most Popular Collection**************************
mostPopularProductDetails(){
  let URL =  this.baseUrl+'front/webservice/mostpopularproduct';
  let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],"pagination":this.storeData.STORE.related_products.enabled,"page_number":this.pageNoMostPopular}
  
  this.httpService.createPostRequest(URL,data).subscribe(response=>{
    if(response.status){
      this.isFirst = false;
      this.mostProductData = response;
      if(response.product_data.length > 0)
      this.isMostPopularProductsAreAvailable = false;
      else
      this.isMostPopularProductsAreAvailable = true;

      response.product_data.map((productItem,index)=>{
        productItem['urlParamsData'] = this.urlBreadcrumbService.getUrl(productItem,{});
        this.mostPopularProducts.push(productItem);
      });
    
      setTimeout(()=>{
       // if(this.mostPopularProducts.length > 3)
     //  if(this.mostPopularProducts.length > 3 && this.mostProductData['total_record'] > 4)
     if(this.globalDataService.isBrowser)
      this.addSilderForMostPopular();
      },1000);
      
      this.image_path = response.listing_path;
      }
    });

 }

 addSilderForMostPopular(){
  //alert(1)
 $(this.mostPopularViewChild.nativeElement).trigger('destroy.owl.carousel');
 $(this.mostPopularViewChild.nativeElement).owlCarousel({

   rtl : false,
   nav : true,
   loop : false,
   autoplay:false,
   slideBy:4,
   responsive : {
     0 : {
       items : 1
     },
     480 : {
       items : 2
     },
     768 : {
       items : 6
     }
   }

 });
 
$(this.mostPopularViewChild.nativeElement).trigger('to.owl.carousel', [this.slideIndex*4, 0, true]);
 setTimeout(()=>{
         $(this.mostPopularViewChild.nativeElement).find(".owl-next").on("click",()=>{
           setTimeout(()=>{
       this.slideIndex = $(this.mostPopularViewChild.nativeElement).find(".owl-dot.active").index();
        this.loadMostPopularProduct({});
           },200);
  });
 },2000);
}
loadMostPopularProduct(productStatus:any){
   if(this.mostProductData.total_record > this.mostPopularProducts.length && this.storeData.STORE.related_products.enabled == 1){
          this.pageNoMostPopular += 1;
          this.mostPopularProductDetails();
     }
    
  
  }
//Function to make URL********************************************
showProductDetail(productItem:any)
{
 let urlData:Array<any> = this.urlBreadcrumbService.getUrl(productItem,6);
 let  categoryData = this.urlBreadcrumbService.breadCrumbCategoryData;

 let productName  = productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name'];
 let sku  = productItem['sku'];
 let breadCrumbData = productItem['parent_detail_data'];
 
   breadCrumbData.push({"name":productName,"sku":sku});
     this.urlBreadcrumbService.saveBreadCrumbDataCategory(breadCrumbData,sku);
     this.urlBreadcrumbService.isSaveBreadCrumb.subscribe((status:boolean)=>{
//  this.router.navigate(urlData,{ queryParams: {id:productItem['_id'],sku:productItem['sku'],ass:productItem['associate'] } });
     });
 
}

}