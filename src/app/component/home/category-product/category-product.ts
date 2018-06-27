import{Component,ViewChild,SimpleChange,Input,Output,ElementRef,ChangeDetectorRef,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { ModelAlertPopup } from '../../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';
//import '../../../../assets/js/owl.carousel.js';
import { GlobalData } from '../../../provider/app.global';
import { CommonService } from '../../../provider/app.common';
import {UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../../provider/app.store-setting';
//import {CurrencyConvertService } from '../../../provider/currencyconvert';
//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'category-types-product',
    templateUrl:'./category-product.html',

    //  providers: [DataService]

})
export class CategoryHome{
        //router:Router; 
        //  dataService:DataService;
       @Input('currentLanguageData') currentLanguageData:any;
       @Input('indexNumber') index :number;
       @Input('currencyConvertService') currencyConvertService:any = {};
       @Input('storeSetting') storeSetting:any = {};
       @Input('blockSettingData') blockSettingData:Object = {};
       @Output('addNewBlock') addNewBlock = new EventEmitter<any>();
       //@Output('addToWishList') addToWishList = new EventEmitter<any>();
       @ViewChild('categoriesTypesProduct') categoriesTypesProduct:any;
       @Input('isRtl') isRtl:boolean;
       @Input('perPageCount') perPageCount : any;
       categoryProduct:any = null;
       baseUrl:string = appConstant['baseUrl'];
       starsCount = 3;
       isLoadingFirst:boolean = true;
       categoryTypesData:any = {};
       categoriesData:Array<any> = [];
       pagNo:number = 1;
       loadcategoriesDataTimeStatus:any;
       storeSettings:any={};
       isLoading:boolean = false;
       slideIndex:number = 0;
     //  stringval:any = "dfgfgggdgdfhfghfghfh";
       
    constructor(private storeSettingOb:StoreSetting,private urlBreadCrumbService: UrlBreadCrumbService,private commonService: CommonService,private globalDataService:GlobalData,private element: ElementRef,private sanitizer: DomSanitizer,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService){
       this.router=router;
       
     /****** for store Setting *****/
//   storeSettingOb.apiSettingsData.subscribe((data) => {
            
//     if(data)
//     {
//       this.storeSettings = data;
//       data['STORE']['breadcrum']['catalog'] == "1"?this.urlBreadCrumbService.toggleBreadCrumb(true):this.urlBreadCrumbService.toggleBreadCrumb(false);
      
 
//     }
// });   
       
}

  
ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
  //alert(this.isRtl)
     // console.log(JSON.stringify(change));
     // if(this.staticBlocksData['currentValue'])
      // this.setBLockData();
      
      if(this.currentLanguageData){
        clearTimeout(this.loadcategoriesDataTimeStatus);
        this.loadcategoriesDataTimeStatus = setTimeout(()=>{
          this.pagNo = 1;
          this.categoriesData = [];
             this.loadCategoryProduct();
            
          },500);
       // this.loadCategoryProduct();
       //$(this.element.nativeElement).find(".owl-carousel").trigger('destroy.owl.carousel');
      }
        
}

addMoreProduct(itemStatus:any){
  //alert();
  if(this.categoryTypesData.product_count > this.categoriesData.length && this.storeSetting.STORE.related_products.enabled == 1 && !this.isLoading){
     this.pagNo +=1;
    
     this.loadCategoryProduct();
  }
   
 }

loadCategoryProduct(){
  //this.categoriesData = [];
 this.isLoading = true;
  this.isLoadingFirst = false;
  //this.isChangeReflect = {};
  //alert(this.categoriesData.length)
 
    let url = this.baseUrl + "front/homepage/home_page_data";
     // this.productId = "59dc7bb73b4b11c6042e0dc2";
      let data = { "lang_id":appConstant['defaultLangId'],"lang":appConstant['defaultLang'],"related_data":this.blockSettingData['releted_data'],"block_name":this.blockSettingData['block_name'],"pagination":this.storeSetting.STORE.related_products.enabled,"page_number":this.pagNo,"per_page":this.perPageCount}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      if(response['status'] == true){
        this.isLoading  = false;
        
        if(response['data'].length > 0){
         
          this.categoryTypesData = response;
          
          response['data'].map((item)=>{  
            item['urlParamsData'] = this.urlBreadCrumbService.getUrl(item,{});
            this.categoriesData.push(item);
           // alert(1234);
            
        
            }); 
          //  console.log("this.categoriesData=="+this.categoriesData.length);
            this.addNewBlock.emit({"status":true});
          setTimeout(()=>{
            if(this.globalDataService.isBrowser && this.categoriesData.length > 1 && this.categoryTypesData.product_count > 4)
            this.setOwlCrowsal();
            else
            {
              if(this.globalDataService.isBrowser)
               $(this.categoriesTypesProduct.nativeElement).css("opacity",1);
            }
           
             },500);

       }
       }
       else  
        this.categoriesData = [];
     
       // alert(1)
    });
   
}
onMouseHOver(e) 
{
   $(e.currentTarget).toggleClass('shadow');
   $(e.currentTarget).find("span.add-to-cart").toggleClass('change-cart');
   $(e.currentTarget).find(".like").toggleClass('changelike');
 }

showProductDetail(productItem:any){
  let productDetailUrl:Array<any> = [];
  let productName  = productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name'];
  let productId = productItem['sku'];
      let  categoryData = productItem['parent_detail_data'];
      categoryData.push({"name":productName,"id":productId});
      this.urlBreadCrumbService.saveBreadCrumbDataCategory(categoryData,productId);
      this.urlBreadCrumbService.isSaveBreadCrumb.subscribe((status:boolean)=>{
     
     if(status){
       //console.log("data=="+JSON.stringify(productDetailUrl))
      // alert("from similar product="+status);
 //this.router.navigate(productDetailUrl,{queryParams:{id:productId,sku:productItem['sku'],ass:productItem['associate']}});
     }
     
      });
      
}
// loadCategoryProduct(){
//       let url = this.baseUrl + "front/webservice/categoryProducts";
//       let data = { "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"cat_id":this.categoryId}
//     this.httpService.createPostRequest(url,data).subscribe((response: any) => {
//       if(response['status'] == true){
//         if(response['product_data'].length > 0)
//       this.categoryProduct = response;
//      // console.log(JSON.stringify(this.categoryProduct));
//     setTimeout(()=>{
//         this.setOwlCrowsal();
//     },500); 
        

//       }
     
//        // alert(1)
//     });
   
// }
setOwlCrowsal(){
  //console.log("rtl=="+this.isRtl)
$(this.categoriesTypesProduct.nativeElement).trigger('destroy.owl.carousel');

//$(this.element.nativeElement).find(".owl-carousel").owlCarousel({
$(this.categoriesTypesProduct.nativeElement).owlCarousel({

    rtl : this.isRtl,
		nav : true,
		loop : false,
		autoplay:false,
		slideBy:6,
    slideSpeed:100,
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
          slideBy:4
      }
  },
		

  });
 $(this.categoriesTypesProduct.nativeElement).css("opacity",1);
     console.log(this.slideIndex)
  $(this.categoriesTypesProduct.nativeElement).trigger('to.owl.carousel', [this.slideIndex*6, 0, true]);
  this.globalDataService.lazyLoad();
  setTimeout(()=>{
     
    $(this.categoriesTypesProduct.nativeElement).find(".owl-next").on("click",()=>{

    setTimeout(()=>{
     
      this.slideIndex = $(this.categoriesTypesProduct.nativeElement).find(".owl-dots .owl-dot.active").index();
     // console.log(this.slideIndex)
     // this.addMoreProduct({});
    },200);


});
},1000);
}
  
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }

     ngAfterViewInit(){
   

  }
}
