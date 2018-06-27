import{Component,ViewChild,SimpleChange,Input,ElementRef,PLATFORM_ID,Inject} from '@angular/core';
import {Router} from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { ModelAlertPopup } from '../../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';
//import '../../../../assets/js/owl.carousel.js';
import { GlobalData } from '../../../provider/app.global';
import { CommonService } from '../../../provider/app.common';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'similar-product',
    templateUrl:'./similar-product.html',

    //  providers: [DataService]

})
export class SimilarProduct{
    //router:Router;
    //  dataService:DataService;
       @Input('currentLanguageData') currentLanguageData:any;
       @Input('isRtl') isRtl:boolean;
       @Input('productId') productId;
       @Input('storeSetting') storeSetting:any = {};
       @ViewChild('similarProductViewChild') similarProductViewChild:any;
       pagNo:number = 1;
       similarProductData:any = {};
       baseUrl:string = appConstant['baseUrl'];
       starsCount = 3;
       model:any = {"rating":3};
       isBrowser:boolean = false;
       similarProduct:Array<any> = [];
       loadSimilarProductTimeStatus:any;
       slideIndex:number = 0;
       
    constructor(private urlBreadcrumbService:UrlBreadCrumbService,@Inject(PLATFORM_ID) private platformId: Object,private currencyconvertservice:CurrencyConvertService,private commonService: CommonService,private globalDataService:GlobalData,private element: ElementRef,private sanitizer: DomSanitizer,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService){
       this.router=router;
       
       
       
}
ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
      //console.log("data=="+JSON.stringify(this.storeSetting)) 
      if(this.currentLanguageData && this.storeSetting){
      this.similarProduct = [];
       this.pagNo = 1;
      if(this.productId)
        this.loadCategoryProduct();
    
      }
        
}
showProductDetail(productItem:any){
  let productDetailUrl:Array<any> = [];
  let productName  = productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name'];
  
 
      //console.log(JSON.stringify(productDetailUrl));
      let productId = productItem['_id'];
       let  categoryData = productItem['parent_detail_data'];
      categoryData.push({"name":productName,"id":productId});
      this.urlBreadcrumbService.saveBreadCrumbDataCategory(categoryData,productId);
      
      this.urlBreadcrumbService.isSaveBreadCrumb.subscribe((status:boolean)=>{
     
     if(status){
     
   }
     
      });
}


//Function to load similar category product*********************************
loadCategoryProduct(){
 // alert("similar Product");
 
    let url = this.baseUrl + "front/webservice/similarProducts";
      
      let data = {
                    "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"id":this.productId,"pagination":this.storeSetting.STORE.related_products.enabled,"page_number":this.pagNo}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
     if(response['status'] == true){
        if(response['brand_data'].length > 0)
        {
          this.similarProductData = response;
         
          response['brand_data'].map((item,index)=>{
           
            item['urlDataParams'] = this.urlBreadcrumbService.getUrl(item,{});
            this.similarProduct.push(item);
             
           });
          
         if(this.globalDataService.isBrowser)
          $("owl-carousel").empty();
          setTimeout(()=>{
            if(this.similarProduct.length>0){
              if(this.globalDataService.isBrowser)
              this.setOwlCrowsal();
              //else
              //this.setOwlCrowsal();
            }
         
             },500); 
        }
   }
   else{
     
    this.similarProduct = [];
   }
   
     
       // alert(1)
    });
   
}
getRating(max,rating){

  //console.log("ratingCount=="+rating)
    let fractionVal:any = (rating%parseInt(rating.toString()))
    let ratingMax = [];
    let item:string;
   // console.log("parseInt(this.ratingCount.toString())=="+parseInt(this.ratingCount.toString()))
if(max > 0){
  for(let i = 0;i<max;i++) {
      if(parseInt(rating.toString()) > i)
      item = 'fa-star'
      else if(parseInt(rating.toString()) == i && fractionVal > .4)
      item = 'half-star';
      else
      item = 'blank';

   ratingMax.push(item);
  
}
return ratingMax;
//console.log("ratingCount=="+this.ratingMax) 

}



}
// FUnction to add more product on slide(SIMILAR PRODUct)**************************************
addMoreProduct(itemStatus:any){
  if(this.similarProductData.total_record > this.similarProduct.length && this.storeSetting.STORE.related_products.enabled == 1){
     this.pagNo +=1;
    
     this.loadCategoryProduct();
  }
   
 }
setOwlCrowsal(){
 // alert("crowsal");
  $(this.similarProductViewChild.nativeElement).trigger('destroy.owl.carousel');
  //alert($(this.element.nativeElement).find(".owl-carousel").length)
  //  $(this.element.nativeElement).find(".owl-carousel").owlCarousel({
   // 
 $(this.similarProductViewChild.nativeElement).owlCarousel({
		rtl : this.isRtl,
		nav : true,
		loop : false,
		autoplay:false,
    slideBy:6,
    responsive:{
      0:{
          items:2,
          nav:true,
          slideBy:2
      },
      600:{
          items:3,
          nav:true,
          slideBy:3
      },
      768:{
          items:4,
          nav:true,
          slideBy:4
      },
      1025:{
          items:6,
          nav:true,
          slideBy:6
      }
  },

  });
  //let owl = $(this.similarProductViewChild.nativeElement).data('owlCarousel');
 // $(this.similarProductViewChild.nativeElement).find(".owl-dot").eq(this.slideIndex).trigger("click");
  //owl.jumpTo(this.slideIndex)
  $(this.similarProductViewChild.nativeElement).trigger('to.owl.carousel', [this.slideIndex*4, 0, true]);
  setTimeout(()=>{
  
   
    $(this.similarProductViewChild.nativeElement).find(".owl-next").on("click",(event)=>{
     setTimeout(()=>{
       this.slideIndex = $(this.similarProductViewChild.nativeElement).find(".owl-dot.active").index();
       //alert(this.slideIndex)
     this.addMoreProduct({});
     },200);
     

});
},1000);
}
  
    ngOnInit() {
        
   
  }

     ngAfterViewInit(){
   
  }
}