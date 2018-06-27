import{Component,OnInit,HostListener,HostBinding,Input,ViewChild} from '@angular/core';
import{Router,ActivatedRoute,Params} from '@angular/router';
import{ElementRef} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
//import { BreadCrumbs } from '../../provider/app.breadcrum';
import {appConstant} from '../../../constant/app.constant';
import * as jQuery from 'jquery';
//import '../../../../assets/js/enscroll.js';
//import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../../provider/app.store-setting';
import { GlobalData } from '../../../provider/app.global';
import { SortingKeywordsService } from '../../../provider/sortingkeywords';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import { NgProgress } from 'ngx-progressbar';
import { FlashMessagesService } from 'ngx-flash-messages';
import { manageCategoryProductService } from '../../../provider/manageCategoryProduct';
import {Loader} from '../../../model/loader/loader-component';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {TranslateService} from '@ngx-translate/core';
import {FilterSearchPipe} from '../../../pipe/filtersearch';
 
declare var $:any;
//declare var jQuery:any;

@Component({
    selector:'product-list-page',
    templateUrl:'./product-list.html',
    providers:[SortingKeywordsService]
})

export class ProductList{
  //@Input("categoryStatus")categoryStatusofCurrentItem:any;
  rangeApplied:boolean = false;
  currentLanguageData:any;
  //storeSettings:any;
  baseUrl:string = appConstant['baseUrl'];
	categoryProduct:any = null;
	categoryId:string;
    breadCrumData:any = {};
    storeSettings:any;
    paging:number = 0;
    perPage:number = 0;
    pageNo:number = 1;
    pagingOther:string;
    sortingOrder:string='';
    slug:string = '';
    isFilter:boolean=false;
    public searcItems:Array<any> = [];
    filterJson:any={};
    showPriceFilter:boolean = false; 
    isFirstAttr:boolean= true;
    filterType:any=false;
    filter_options:Array<any>=[];
    filter_options_category:any=[];
    filter_options_brands:any=[];
    categorycheckedcount:any;
    brandcheckedcount:any;
    order:string='';
    imagePath:any;
    filter_options_Attributes:any=new Array;
    isAddTocart:boolean = false;
    isaddToWish:boolean = false;
    isProductCountShow:any=0;
    promo_url:any='';
    limittoproductshow:any = appConstant['limittoproductshow'];
   // brandclicked:boolean=false;
   // catclicked:boolean=false;
    AttrJson:any={};
    filterCat:any=[];
    filterBrand:any=[];
    pricefilterJson:any=[];
    minprice:number = 0;
    minimumprice : number = 100;
    maxprice:number= 0;
    sortingkeys:any=[];
    productData :any = new Array();
    totalProductDataLength:any=0;
    activatedRoute:ActivatedRoute;
    type:string;
    urlBreadcrumbService:UrlBreadCrumbService;
    typeArr:any;
    filterAttrJson:any={};
    promoURL:any='';
    isFilterOptionFirst:boolean=false;
    isFirst:boolean=true;
    arr_val:any=[];
    array_val:any=[];
    min_price:number=0;
    max_price:number=0;
    cat_id:any;
    categoriesData:any=[];
    loadListFirst:boolean = false;
    searchkey:string='';
    paramsNavigation:boolean = false;
    globalSearch:string = '';
    itemstart:number=0;
    itemend:number=0;
    queryParams:any;
    isUrlFromQueryParams:boolean = false;
    total:any=0;
    addedToWishlistProductID:any = new Array();
    catId:string = '';
    minType:boolean=false;
    maxType:boolean=false;
    currencyData:any={};
    slideToggleRef:any = {};
    isProductNotExists:boolean = false;
    isAPIDataRcvd:boolean = false;
    color:any = appConstant['color'];
    queryFilterParams:any;
    isLoadMore:boolean=false;
    loadingDataInterval:any;
    throttle:number = 1000;
    pagingType = appConstant['PAGINGTYPE'];
    lazyLoader:boolean = false;
    userWishlistData:Array<any> = [];
   // isFitlerAlreadyApplied:boolean = false;
    isFitlerFirst :boolean = false;
    errormsg:any='';
    isProductPage:string = 'product';
    filterCountShow:any;
    urlInfo:any;
    globalSearchPerPage:number = 0;
    userDetail:any;
    typeofAddToCartfromDetail = appConstant['typeofAddToCartfromDetail'];
    pinNo:number;
    sortedTranslateLabels:Array<any> = [];
    attrExpended:any;
    currentAttributeValue:any = '';
    priceArr:any = new Array();
    minPriceObRef;
    maxPriceObRef;
    //filterAttributeArray : any = [];
    filterSearchkey:string = '';
    
    @HostListener("window:scroll") function(){
      
     clearTimeout(this.loadingDataInterval);
     this.loadingDataInterval = setTimeout(()=>{ 
       
     if(this.productData.length>0  && !this.isFirst && this.isLoadMore && (this.totalProductDataLength > this.productData.length))
     this.loadMoreData();
      },200);
    };
   
constructor(private translateService:TranslateService,private manageCategoryProduct:manageCategoryProductService,private meta : Meta,private flashMessagesService: FlashMessagesService,private ngProgress: NgProgress,sortingkeywordsService:SortingKeywordsService,urlBreadcrumbService:UrlBreadCrumbService,private currencyconvertservice:CurrencyConvertService,activatedRoute:ActivatedRoute,private globalDataService:GlobalData,private storeSettingOb:StoreSetting,private breadCrumService:UrlBreadCrumbService,private router:Router,private activateRoute:ActivatedRoute,private element: ElementRef,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
{
  let setTimeoutInterval;
  // $(window).on("scroll",()=>{
  
  //   clearTimeout(setTimeoutInterval);
  //  setTimeoutInterval = setTimeout(()=>{
  //     this.setSideBarMenu();
  //   },100)
    
  // })

 
  this.translateService.get('sortingArray').subscribe((sortedLabels:Array<any>)=>{
      this.sortedTranslateLabels = sortedLabels;
  });
  
 if(this.globalDataService.isBrowser){
   this.userDetail   = JSON.parse(localStorage.getItem('userLoginDetail'))?JSON.parse(localStorage.getItem('userLoginDetail')):null;
  this.pinNo  = parseInt(localStorage.getItem("pinNo"))?parseInt(localStorage.getItem("pinNo")):undefined;
  
  
  
 }
       if(this.globalDataService.isBrowser){
          if(localStorage.getItem("userWishList") != 'undefined' && localStorage.getItem("userWishList"))
   {
  
   this.userWishlistData =  JSON.parse(localStorage.getItem("userWishList"));
  }
       }
 
  this.activatedRoute = activatedRoute;
  this.urlBreadcrumbService=urlBreadcrumbService;
/******** for breadcrum *******/
        this.urlBreadcrumbService.breadcrumbInfo.subscribe((data) => {
            if(data){
               this.breadCrumData = data;
               } 
          });

    
 // Get URL Info from service************************************
this.manageCategoryProduct.URLInfo.take(1).subscribe((urlDetails)=>{
  console.log("URLdetails"+JSON.stringify(urlDetails));
    this.urlInfo = urlDetails['catData'];
    this.currentLanguageData = urlDetails['langData'];
    if(this.urlInfo.type == 'params' && this.urlInfo.cat_status == this.isProductPage)
    {
      this.navigateByParams(this.urlInfo['data']);
      }
      else if(this.urlInfo.type == 'queryParams' && this.urlInfo.cat_status == this.isProductPage){
        this.navigateByQueryParams(this.urlInfo['data']);
      }
    });

   
     languageTranslateInfoService.translateInfo.subscribe((data) => {
      
                if (this.globalDataService.isBrowser && data)
                {
                   
               //  $(".mCustomScrollbar").mCustomScrollbar('destroy');
                    this.currentLanguageData = data;
                    if(!this.isFirst)
                    {
                     this.filterOptions();
                    }
                    if(localStorage.getItem("filterJSON"))
                    this.isFilter = true;
                  
                }
          });
    /****** for store Setting *****/
      storeSettingOb.apiSettingsData.subscribe((data) => {
       this.storeSettings = data;
      if(this.storeSettings)
      {
      this.storeSettings['STORE']['breadcrum']['catalog'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
      this.paging = this.storeSettings['STORE']['PAGING'];
      //this.paging = 0;
      this.perPage = this.storeSettings['STORE']['PERPAGE'];
      this.globalSearchPerPage = this.storeSettings['STORE']['GLOBALSEARCH'];
      this.filterCountShow = this.storeSettings['STORE']['FILTERCOUNT'];
      this.pagingOther = this.storeSettings['STORE']['PAGINGOTHER'];
      //this.pagingOther = 'pagination';
      if(this.pagingOther == this.pagingType)
      this.lazyLoader = true;
      this.isProductCountShow = this.storeSettings['STORE']['FILTERCOUNT'];
      if(this.urlInfo.type == "queryParams")
      {
        this.perPage = this.globalSearchPerPage;
        //alert(this.urlInfo.type);
      }
        if(this.isFirst)
        {
          this.filterOptions();
        }
      }
      });
   
    
      
    }

    // trackByIndex(index: number, value: any) {
    //  // alert(index);
    //  console.log("index");
    //  console.log(value.atribute_code);
    //   return value.atribute_code;
    // }
  

  /******************************************************************** 
 // Function for execute code when navigate from header*****************
 *********************************************************************/
    navigateByParams(params)
    {
      this.globalSearch = "";
      if(this.globalDataService.isBrowser)
     localStorage.removeItem("filterJSON");
      this.isFilter = false;
     this.slug = params['slug'];
    this.loadListFirst = true;
    this.paramsNavigation = true;
    this.isProductNotExists = false;
    this.isAPIDataRcvd = false;
    this.totalProductDataLength = 0;

    this.urlBreadcrumbService.breadCrumbCategoryData = [];
    this.catId = '';
    //this.isFirst = true;
    if(!this.isFirst && !this.isUrlFromQueryParams)
    {

      if(this.pagingOther == this.pagingType)
      {
        this.productData = [];
        // this.isLoadMore = true;
      }

      this.isFilter = false;
      this.filterJson = {};
      this.filterCat = [];
      this.filterBrand =[];
      this.pricefilterJson =[];
      this.filterAttrJson={};
      this.minprice = 0;
      this.isFilterOptionFirst=false;
      this.filterOptions();
    }
     /******************get breadcrum********************** */
     if(!this.globalSearch)
       this.breadCrumService.setBreadCrumbDataFromServer(this.slug,'');
    }
/******************************************************************** 
// Function for execute code when you go via query param from URL****
*********************************************************************/
    navigateByQueryParams(queryParams)
    {
      this.slug = "";
      if(this.globalDataService.isBrowser)
     localStorage.removeItem("filterJSON");
      this.isFilter = false;
    this.queryParams = queryParams;
    this.loadListFirst = true;
    this.totalProductDataLength = 0;
    this.globalSearch = '';
    this.isUrlFromQueryParams = true;
    this.isProductNotExists = false;
    this.isAPIDataRcvd = false;

    if(queryParams['key'])
    {
       this.promoURL = queryParams['key'];
    }
    else if(queryParams['search'])
    {
        this.globalSearch = queryParams['search'];
        this.catId = '';
    }
    if(!this.isFirst)
    {
       this.filterOptions();
    }
    if(this.pagingOther == this.pagingType)
      {
        this.productData = [];
        // this.isLoadMore = true;
      }
      
    }
    
//Function to get url of product**************************************
getUrl(productItem:any){
  let  productId = productItem['_id'];
    let productName = productItem['translation_data'][0]['name'] != ''?productItem['translation_data'][0]['name']:productItem['name']['name'];
 let urlDataWithParams = {};
let urlData:Array<any> = this.urlBreadcrumbService.getUrl(productItem,{});
return  urlData;

  
}
 
//Function to check wishlist Data inside Array***********************
isProductAvailableInWishList(productdata:Array<any>,isUrlStats:boolean)
 {
  let status = false;
  productdata.map((productItem,index)=>{
   status = false;
  for(let i = 0;i<this.userWishlistData.length;i++)
  {
      if(productItem['_id'] == this.userWishlistData[i]['product_id'])
      {
        status = true;
        break;
      }
  }
  productItem['isWishlist'] = status;
  productItem['urlDataParams'] = this.getUrl(productItem);
});

}

 //Function to get product list inside a category*********************
  loadCategoryProduct(page_num:number)
  {
    if(this.globalDataService.isBrowser && localStorage.getItem("filterJSON"))
    this.filterJson = JSON.parse(localStorage.getItem("filterJSON"));
    
    this.pageNo = page_num;
    this.isLoadMore = false;
    let URL;
    this.ngProgress.start();
    if(this.globalDataService.isBrowser)
    $(".content").css("opacity",0.5);
    if(this.promoURL)
    URL = this.baseUrl+"front/promotion/promotion_product_list";
    else
      URL = this.baseUrl + "front/webservice/categoryProducts";
      let data;
      // if(this.searchkey != '')
      // {
      //   this.order = this.searchkey;
      //  }
      //  else{
      //   this.order = this.searchkey;
      //  }
       if(this.pagingOther != this.pagingType)
      {
       this.itemstart =((this.pageNo-1)*this.perPage)+1 ;
        this.itemend = this.perPage*this.pageNo;
      }

      if(this.promoURL)
      {
      if(this.isFilter)
      {
      data = { "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"cat_id":this.catId,
                "order":this.sortingOrder,pagination:this.paging,"page_number":this.pageNo,slug:this.slug,per_page:this.perPage,url:this.promoURL,type:this.filterType,search:this.filterJson,"search_data":this.globalSearch};
      }
      else
      { 
        data = {
        "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"cat_id":this.catId,
         "order":this.sortingOrder,pagination:this.paging,"page_number":this.pageNo,per_page:this.perPage,slug:this.slug,url:this.promoURL,type:this.filterType,"search_data":this.globalSearch};  
      }
    }
      else
      {
        if(this.isFilter)
          data = { "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],slug:this.slug,"cat_id":this.catId,order:this.order,pagination:this.paging,page_number:this.pageNo,per_page:this.perPage,search:this.filterJson,"search_data":this.globalSearch};
         else
           data = { "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],slug:this.slug,"cat_id":this.catId,order:this.order,pagination:this.paging,page_number:this.pageNo,per_page:this.perPage,"search_data":this.globalSearch };
      }

    this.httpService.createPostRequest(URL,data).subscribe((response: any) => {
      this.isAPIDataRcvd = true;
      this.ngProgress.done();
      this.isFirst = false;
      
      if(response['status'] == true)
      { 
        let catInfo;
        this.totalProductDataLength = response.total_record;
         if(response['product_data'].length>0)  
         {
           /******* get parnet category in case of search *****/
           if(this.globalSearch)
        this.breadCrumService.setBreadCrumbDataFromServer('',response['category_name']['id']);

            if(this.pagingOther == this.pagingType)
            this.isLoadMore = true;
        
            if(this.isFilter && this.isFitlerFirst){
             
              this.isFitlerFirst = false;
            }
            
            
          this.isProductNotExists = false; 
            catInfo = response.category_name;
            /*Meta Tag *************************************************/
            let cat_basic_path = response.cat_thumb_path;
            this.meta.updateTag({name:"title",content:catInfo.page_title?catInfo.page_title:catInfo.name});
            this.meta.updateTag({name:"keywords",content:catInfo.meta_key?catInfo.meta_key:catInfo.name});
            this.meta.updateTag({name:"description",content:catInfo.meta_desc?catInfo.meta_desc:catInfo.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"og:title",content:catInfo.page_title?catInfo.page_title:catInfo.name});
            this.meta.updateTag({name:"og:image",content:catInfo.category_image?cat_basic_path+catInfo.category_image:''});
            this.meta.updateTag({name:"og:description",content:catInfo.meta_desc?catInfo.meta_desc:catInfo.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"twitter:title",content:catInfo.page_title?catInfo.page_title:catInfo.name});
            this.meta.updateTag({name:"twitter:description",content:catInfo.meta_desc?catInfo.meta_desc:catInfo.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"twitter:image",content:catInfo.category_image?cat_basic_path+catInfo.category_image:''});
        
          
            this.categoryProduct = response;
            this.isUrlFromQueryParams = false;
            this.paramsNavigation = false;
            if((this.loadListFirst == true && this.categoryProduct['product_data'].length == 0) ||this.categoriesData.length>0)
            this.showPriceFilter = false;
            else 
            this.showPriceFilter = true;

            this.loadListFirst = false;
          //  let enablebreadCrubmbIsEntered = true;
            this.isProductAvailableInWishList(response.product_data,true);
            // this.urlBreadcrumbService.breadCrumbMenuData.subscribe((breadCrumbData)=>{
            // if(breadCrumbData && enablebreadCrubmbIsEntered){
            //   enablebreadCrubmbIsEntered = false;
            //   this.isProductAvailableInWishList(response.product_data,true);
            //   }
            // });

        //*******************************ON SCROLL CODE CALL ******************************/
          if(this.pagingOther == this.pagingType)
          {
              for(let a= 0;a<response.product_data.length;a++){
                this.productData.push(response.product_data[a]);
              }

              if(this.productData.length < this.totalProductDataLength)
              this.isLoadMore = true;
              else if(this.productData.length == this.totalProductDataLength)
              this.isLoadMore = false;
          }
          else{
            this.productData = response.product_data;
           // this.categoryData = response.category_name;
           // console.log(JSON.stringify(this.productData));
            this.total = response.total_record;
          if(this.total<this.itemend)
          this.itemend = this.total;
          this.imagePath = data.listing_path;
            
        } 
        
        /******************************************************************************* */
       }
        else{
         // this.breadCrumService.toggleBreadCrumb(false);
          //this.isLoadMore = false;
          this.isProductNotExists = true;
          this.productData = [];
          }
        }
      else{
        this.breadCrumService.toggleBreadCrumb(false);
        this.errormsg = response.msg;
        this.isProductNotExists = true;
      }
     
     
      //this.loader.hideLoader();
     setTimeout(()=>{
       if(this.globalDataService.isBrowser)
       $(".content").css("opacity",1);
      },400);
    });
}
 //Function to load more Data****************************************************************************/ 
 loadMoreData(){
  //alert(1)
  if(this.globalDataService.isBrowser){
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
 let clientHeight =  document.documentElement.clientHeight || document.body.clientHeight;
 let scrollHeight =  document.documentElement.scrollHeight || document.body.scrollHeight;
 let windowWidth =   document.documentElement.clientWidth || document.body.clientWidth;
  if(this.totalProductDataLength >this.productData.length && (scrollTop + clientHeight+this.throttle >= scrollHeight))
   {
      this.pageNo += 1;
    this.loadCategoryProduct(this.pageNo);
  }
  if(this.totalProductDataLength == this.productData.length)
    this.isLoadMore = false;
  }
  
   }

//****************************************************************************************************** */
    showProductDetail(productItem:any)
    {
       
    let  sku = productItem['sku'];
    let breadCrumItem = this.breadCrumData['data'];
    let produtName  = productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name'];
    let productId  = productItem['_id'];
    let catName:string = null;
    let subCatName:string = null;
    let innerCatName:string = null;
    let catId:number = 0;
    let subCatId:number = 0;
    let innerCatId:number = 0;
    let urlString:string;
    let urlData:Array<any> = this.urlBreadcrumbService.getUrl(productItem,{});
    //this.breadCrumService.getUrl(productItem['brand_data'],this.queryParams);
    if(this.isAddTocart || this.isaddToWish)
    {
      let URLDatatosave = {};
      URLDatatosave['urlData'] = urlData;
      URLDatatosave['queryParams'] = {id:productItem['_id'],sku:productItem['sku'],ass:productItem['associate'] };
      return URLDatatosave;
    }
    else
    {
      //alert($(".mCustomScrollbar").length)
    //  if(this.globalDataService.isBrowser)
   // $(".mCustomScrollbar").mCustomScrollbar('destroy');
      let  categoryData = this.urlBreadcrumbService.breadCrumbCategoryData;
      categoryData.push({"name":produtName,"id":productId});
      // let productName = productItem['translation_data'][0]['name'] != ''?productItem['translation_data'][0]['name']:productItem['name']['name'];

      this.urlBreadcrumbService.saveBreadCrumbDataCategory(categoryData,sku);
      
      this.urlBreadcrumbService.isSaveBreadCrumb.subscribe((status:boolean)=>{
          //  this.router.navigate(urlData,{ queryParams: {id:productItem['_id'],sku:productItem['sku'],ass:productItem['associate'] } });
          //  this.urlBreadcrumbService.saveBreadCrumbDataCategory(categoryData,sku);
      })
    }
}
addToCart(event,productItem){
  
  if(productItem.varient_data == null){
      event.preventDefault();
      event.stopPropagation();
     // return false;
  }
  else return false;
   let userId = this.userDetail?this.userDetail['id']:null; 
   let browser_id;
   if(this.globalDataService.isBrowser){
     browser_id = Cookie.get('browser_id');
   }
   let urlData = {"urlData":this.breadCrumService.getUrl(productItem,{}),"queryParams":{}};
   let currencyId = this.currencyconvertservice.currentCurrencyData['id'];
    let data = {"user_id":userId,"type" :this.typeofAddToCartfromDetail,"associate":productItem['associate'],"product_id":productItem['_id'],"sku":productItem['sku'],"quantity":1,"vendor_id":productItem['vendor_id'],"pin_no":this.pinNo,"session_id":browser_id,"shipping_id":"","currency_id":currencyId,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],urldata:urlData};
     let url = this.baseUrl + "front/basket/add_to_cart";
     this.ngProgress.start();
     this.httpService.createPostRequest(url,data).subscribe((response: any) => {
          this.ngProgress.done();
           if(response['status']){
               ///alert();
            this.flashMessagesService.show(response['msg'], {
                classes: ['alert', 'alert-success'], // You can pass as many classes as you need
                timeout: 1000, // Default is 3000
              });
              setTimeout(()=>{this.router.navigate(["/cart"])},1000);
         }
        else{
            this.flashMessagesService.show(response['msg'], {
                classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
                timeout: 1000, // Default is 3000
              });
        }
       
       // this.globalData.showToaster({type:"error",body:response['msg']});
        
      });
   //console.log(JSON.stringify(data));


}
navigateToInnerCategory(parentItem:any,subItem:any,innerItem:any)
  {
		//this.hideSubMenu("event");
		let parentCatName:string = parentItem.translation_data.length > 0?parentItem['translation_data'][0]['name']:parentItem['name'];
    let parentCatId = parentItem['_id'];
    let parentSlug = parentItem['slug'];
    let subCatName:string = subItem.translation_data.length > 0?subItem['translation_data'][0]['name']:subItem['name'];
    let subCatId = subItem['_id'];
    let subSlug= subItem['slug'];
    let innerCatName:string = innerItem.translation_data.length > 0?innerItem['translation_data'][0]['name']:innerItem['name'];
  
    let innerCatId = innerItem['_id'];
    let innerSlug = innerItem['slug'];
  let breadCrumbItem = {"data":[]};
    breadCrumbItem['data'].push(parentItem);
    breadCrumbItem['data'].push(subItem);
    breadCrumbItem['data'].push(innerItem);
  
   // this.storeBreadCrumData(breadCrumbItem);
   
    return innerItem['cat_status']?["/"+this.relaceSpecialCharacter(parentSlug),this.relaceSpecialCharacter(subSlug),this.relaceSpecialCharacter(innerSlug)]:["/"+this.relaceSpecialCharacter(parentSlug),this.relaceSpecialCharacter(subSlug),this.relaceSpecialCharacter(innerSlug)];
  
	  }
    relaceSpecialCharacter(item){
		  return item;
			//return item.replace(/\(|\) |\s/g, "").toLowerCase();
	  }
     onMouseHOver(e) 
     {
        $(e.currentTarget).toggleClass('shadow');
        $(e.currentTarget).find("span.add-to-cart").toggleClass('change-cart');
        $(e.currentTarget).find(".like").toggleClass('changelike');
      }
  ngOnInit() { }
  ngOnDestroy(){
  //  alert($(".filter-section").length)
   
  }
   // FUnction for Slider********************************
   runSlider(){
 
   // alert("minprice"+this.minprice+"maxprice"+this.maxprice+"min_price"+this.min_price+"max_price"+this.max_price);
    //$(".select-dropdwn").selectBoxIt({ });
    let max = this.max_price
   $("#slider-range").slider({
    range : true,
    min :this.min_price,
    max : this.max_price,
    values : [this.minprice, this.maxprice],
    slide:(event,ui)=>{
      
    },
    stop:(event,ui)=>{
     
       this.rangeApplied = true;
      if(ui.handleIndex==0){
       
       if(ui.value > 100)
       {   
         let remainder = ui.value % 100;
        this.minprice = ui.value-remainder;
       }
       $('#amount_min').val(this.minprice).change();
       this.filterApply('min','price',this.minprice);
     }
     else if(ui.handleIndex==1){
       
       let remainder = ui.value % 100;
       this.maxprice = ui.value-remainder;
       $('#amount_max').val(this.maxprice).change();
       this.filterApply('max','price',this.maxprice);
     }
     
    
      console.log("this.minprice"+this.minprice+"this.maxprice"+this.maxprice);
    }
    
   });
   }
   //Function for getting filter options******************
filterOptions()
{  
  if(this.globalDataService.isBrowser)
  {
   if(localStorage.getItem("filterJSON"))
  this.filterJson = JSON.parse(localStorage.getItem("filterJSON"));
}
 
//this.priceArr = [];
 // alert(JSON.stringify(this.filterJson));
  this.isLoadMore = false;
    this.productData = [];
  if(!this.catId)
  this.catId = '';
    let URL = this.baseUrl + "front/webservice/filter_option";
    let data;
    if(this.promoURL)
    {
      this.catId = '59afabb8883c44263161f2ee';
      this.filterType = "promotion";
      this.promo_url = this.promoURL;
    }
    if(this.isFilter)
    {
      //this.categoryId = '5a152c8db4d624e51d8c4e74';
     data = {cat_id:this.catId,lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],slug:this.slug,search_data:this.globalSearch,search:this.filterJson,type:this.filterType,url:this.promo_url};
    }
    else
    {
      data = {cat_id:this.catId,lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],slug:this.slug,search_data:this.globalSearch,type:this.filterType,url:this.promo_url};
    }
      this.httpService.createPostRequest(URL,data).subscribe(data=>{
        this.loadCategoryProduct(1);
      if(data.status && !data.category_status)
      {
          // console.log("from filter*************=="+this.isFirst)
          
       this.filter_options = data;
      
       this.categoriesData = [];
       this.filter_options_category = data.category[0].category_data;
       this.categorycheckedcount = data.category[0].check_count;
       this.filter_options_brands = data.brand_detail[0].brand_data;
       this.brandcheckedcount = data.brand_detail[0].check_count;
       this.filter_options_Attributes = data.Attributes;
      // alert();
     // let arr = [1,2,3,4];
      //console.log(arr.indexOf(1)>-1);
     //  console.log(JSON.stringify(this.filter_options_Attributes));
      
      // console.log("data.price.min_price"+data.price.min_price+"data.price.max_price"+data.price.max_price);
      
        // console.log(this.priceArr);

      if(this.isFilterOptionFirst)
      {
         this.isFirstAttr = false;
         
      }
      if(!this.isFilterOptionFirst)
       {
         //alert(1);
         for(let c =0;c<this.filter_options_Attributes.length;c++)
         {
          this.AttrJson[this.filter_options_Attributes[c].atribute_code]='false';
         } 
         
         for(let price= data.price.min_price; price < data.price.max_price ; price+= 100){
          this.priceArr.push(price);
         }
         this.priceArr.push(data.price.max_price);
            // if(this.isFirst)
             this.min_price = data.price.min_price;
             this.max_price = data.price.max_price;
             this.minprice = data.price.min_price;
             this.maxprice = data.price.max_price; 
             
            setTimeout(()=>{ 
             this.minPriceObRef =  $("#amount_min").selectBoxIt({ });
             this.maxPriceObRef = $("#amount_max").selectBoxIt({ });
             this.minPriceObRef.on("change",(event)=>{
              this.priceValueChange(event,"min");
             });
             this.maxPriceObRef.on("change",(event)=>{
               this.priceValueChange(event,"max");
             });
              this.runSlider();
              },500);
            
             
          }   
          else if(this.isFilterOptionFirst && !this.rangeApplied){
            
             // this.min_price = 0;
            //  this.max_price = data.price.max_price;
            //  this.minprice = data.price.min_price;
            //  this.maxprice = data.price.max_price;
          
          }
           setTimeout(()=>{
             if(this.globalDataService.isBrowser){

             }
          //    if(this.globalDataService.isBrowser){
          //      if($('.mCustomScrollbar').length)
          //  $('.mCustomScrollbar').mCustomScrollbar({ 
          //     theme:"dark-3"        
          //  });
          //    }
             
        },1000);
      }
      else if(data.category_status)
      {
        data.category.map((menuItem,index)=>{
					menuItem['urlLink'] = this.navigateToCategory(menuItem);
					menuItem.sub_cat.map((subMenu,subIndex)=>{
						subMenu['urlLink'] = this.navigateToSubCategory(menuItem,subMenu);
						subMenu.sub_cat.map((innerMenu,innerIndex)=>{
						innerMenu['urlLink'] = this.navigateToInnerCategory(menuItem,subMenu,innerMenu);
					});
					});
				});
        this.categoriesData = data.category;
        this.showPriceFilter = false;
       
      }
  
      
    });
  }
  

ngAfterViewInit(event) 
{
  
}
addCustomSelectBox(){
  var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) 
        {
          if (s.options[i].innerHTML == this.innerHTML) 
          {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) 
            {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", (e)=> {
    //doucument.getElementById("sortingOrder")
    let selectVal = e.target.innerHTML;
    let sortedOpt = document.getElementById("sortingOrder")['options'];
    for(let i =0;i<sortedOpt.length;i++)
   { 
     if(selectVal == sortedOpt[i].innerHTML )
     {
       this.sortingOrder = sortedOpt[i].value;
       //console.log("option matcj=="+sortedOpt[i].innerHTML)
       break;
     }
     
   }
    
    //this.searchkey = this.sortingOrder;
   // console.log(1111111+this.searchkey)
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(e.target);
      e.target.nextSibling.classList.toggle("select-hide");
     e.target.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

}

//Function for show attributes
openAttribute(val,outerIndex)
{
  this.currentAttributeValue = val;
  //var attrval = $("."+val);
   $("."+val).toggle();
   if($("#"+val).attr('title')=="more"){
    //this.currentAttributeValue = '';
     $("#"+val).text('Less');
     $("#"+val).attr("title", "less");
     this.AttrJson[val]='true';
   }else{
   // this.currentAttributeValue = val;
     $("#"+val).text('Load More');
     $("#"+val).attr("title", "more");
    }
  }

  //Function for filter API***************************
filterApply(value,type,event){
 // event.stopPropagation();
 // event.stopImmediatePropagation();
  this.totalProductDataLength = 0;
  this.slideToggleRef[type] = type;
   if(type=='category')
    {
     if(event.target.checked)
     {
       this.filterCat.push(value);
     }
     else if (!event.target.checked){
       let index = this.filterCat.indexOf(value);
       this.filterCat.splice(index,1);
     }
   }
   else if(type=='brand')
   {
     if(event.target.checked)
     {
       this.filterBrand.push(value);
     }
     else if (!event.target.checked){
       let index2 = this.filterBrand.indexOf(value);
       this.filterBrand.splice(index2,1);
     }
   }
   else if(type=='price')
   {
    this.pricefilterJson = {max:this.maxprice,min:this.minprice};
    this.filterJson.price =  Object.assign({},this.pricefilterJson);
   }
   else
   {
     this.type = type;
     this.typeArr = type;
     if(this.filterAttrJson.hasOwnProperty(this.type))
     {
      if(event.target.checked){
         this.filterAttrJson[this.type].push(value);
       }
        else if (!event.target.checked){
           // alert(1);
           let index2 = this.filterAttrJson[this.type].indexOf(value);
           this.filterAttrJson[this.type].splice(index2,1);
         }
       }
       else
       {
         this.typeArr = new Array();
          if(event.target.checked)
          {
            this.typeArr.push(value);
          }
          else if (!event.target.checked){
            let index2 = this.typeArr.indexOf(value);
            this.typeArr.splice(index2,1);
          }
          this.filterAttrJson[this.type] = this.typeArr;
       }
  }
   this.filterJson.cat_ids = this.filterCat;
   this.filterJson.brand = this.filterBrand;
   this.filterJson.product_data = this.filterAttrJson;
   localStorage.setItem("filterJSON",JSON.stringify(this.filterJson));
   this.isFilter = true;
   if(!this.isFitlerFirst)
    this.isFitlerFirst = true;
  
   this.isFilterOptionFirst = true;
   let count = 0;
   this.arr_val = [];
   let objectlength = Object.keys(this.filterAttrJson).length;
   let priceFilterObjLength = Object.keys(this.pricefilterJson).length;
   //alert("priceFilterObjLength"+priceFilterObjLength);
   if(this.filterCat.length==0 && this.filterBrand.length==0 && priceFilterObjLength ==0 && objectlength > 0)
     {
       for (var key in this.filterAttrJson) {
     
         if (this.filterAttrJson.hasOwnProperty(key)) 
         {
         
            if(this.filterAttrJson[key].length==0)
            {
               count = count+1;
               this.arr_val.push(this.filterAttrJson[key].length);
             }
          }
     }
   if(count>0 && (this.arr_val.length)>0 && (objectlength == this.arr_val.length) && (this.arr_val.length == count))
     {
      this.isFilter = false;
      this.isFitlerFirst = false;
       localStorage.removeItem("filterJSON");
     }
    }
    else if(this.filterCat.length==0 && this.filterBrand.length==0 && objectlength==0 && priceFilterObjLength ==0 )
    {
      this.isFilter = false;
      this.isFitlerFirst = false;
       localStorage.removeItem("filterJSON");
    }
  
   this.filterOptions();   

 }
 
 
 priceValueChange(event,price_type){ 
  // alert(price_type);
   let newvalue = event.target.value;
  //alert("priceValueChange"+newvalue);
  this.rangeApplied = true;
   if(price_type =='min'){
    this.minType = true;
    this.minprice = newvalue;
   // this.min_price = newvalue;
    this.filterApply('min','price',this.minprice);
   
   }
   else{
    this.maxprice = newvalue;
   // this.max_price = newvalue;
    this.filterApply('max','price',this.maxprice);
   
   }
   this.runSlider();
  
 }
 
 hideSuggestionBox(){
	  this.searcItems = [];
  }
 //Function for clear search data**************
 clearsearch(type)
 {
  this.totalProductDataLength = 0;
   //alert(type);
    this.productData = [];
    if(type=='category'){
       this.filterCat = [];
       this.filterJson.cat_ids = [];
 
     }
      else if(type=='brands'){
       this.filterBrand =[]
       this.filterJson.brand = [];
      }
      else if(type=='price'){
      this.pricefilterJson =[];
       this.minprice = 0;
       this.filterJson.price =  Object.assign({},this.pricefilterJson);
       delete this.filterJson.price;
       this.rangeApplied = false;
      }
     else{
       this.filterJson.product_data[type] = [];
        this.filterAttrJson[type] = [];
          delete  this.filterAttrJson[type];
        delete this.filterJson.product_data[type];
        for(let key in this.AttrJson){
         if(key==type){
            this.AttrJson[key]='false';
          }
        }
      }
      let count = 0;
      this.array_val = [];
     
      let objectlength = Object.keys(this.filterAttrJson).length;
     // alert(objectlength);
     let priceFilterObjLength = Object.keys(this.pricefilterJson).length;
      //alert("priceFilterObjLength"+priceFilterObjLength);
      if(this.filterCat.length==0 && this.filterBrand.length==0 && priceFilterObjLength ==0 && objectlength > 0)
     {
        for (var key in this.filterAttrJson) {
      
          if (this.filterAttrJson.hasOwnProperty(key)) 
          {
           if(this.filterAttrJson[key].length==0)
             {
                count = count+1;
                this.array_val.push(this.filterAttrJson[key].length);
               // alert(this.array_val);
                }
           }
      }
   
      if(count>0 && (this.array_val.length)>0 && (objectlength == this.array_val.length) && (this.array_val.length == count))
      {
        
        this.isFilter = false;
        this.isFilterOptionFirst = false;
        this.isFitlerFirst = false;
        this.productData = [];
        this.pageNo = 1;
         localStorage.removeItem("filterJSON");
      
       }
       
     }
     else if(this.filterCat.length==0 && this.filterBrand.length==0 && objectlength==0 && priceFilterObjLength ==0 ){
       this.isFilter = false;
       this.isFilterOptionFirst = false;
       this.isFitlerFirst = false;
       this.productData = [];
       this.pageNo = 1;
        localStorage.removeItem("filterJSON");
     }
      localStorage.setItem("filterJSON",JSON.stringify(this.filterJson));
   // console.log(JSON.stringify(this.filterJson));
    this.filterOptions();
   }

 // for sorting API call****************************
 searchkeychange(event,searchkey)
 {
   $(event.target).parent().siblings().removeClass("active");  
    $(event.target).parent().addClass("active");
   
   this.sortingOrder = searchkey;
  
  //this.productData = [];
 //this.order = searchkey;
 //alert(this.order);
 // this.loadCategoryProduct(1);

 }
 // Function to add a product to wishList *****************************
addToWishList(event,sku,productId,productJSON)
{
  event.stopPropagation();
  event.preventDefault();
  this.isaddToWish = true;
  if(localStorage.getItem('userLoginDetail')){
    let ProductDetailURL = this.showProductDetail(productJSON);
    let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
    let URL =  this.baseUrl + "front/order/add_to_wish_list";
    let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],slug:this.slug,sku:sku,product_id:productId,user_id:userDetail.id,urldata:ProductDetailURL};
    
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
        this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-success'], // alert-success,alert-warning,alert-info,alert-danger You can pass as many classes as you need
          timeout: 1000, // Default is 3000
        });
       
         this.addedToWishlistProductID.push(productId);
         this.globalDataService.addToWishListInLocalStorage(response['wishlist_detail']);
         this.userWishlistData = response['wishlist_detail'];
         this.isProductAvailableInWishList(this.productData,false);
         }
         else{
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-danger'], // You can pass as many classes as you need
            timeout: 1000, // Default is 3000
          });
         }
     });
  }
  else{
    //this.openLoginPopup(); 
    this.globalDataService.openPopUp(document.querySelector("#login"));
  }
}

// Function to remove a product from wishList *****************************
removeFromWishList(event,sku,productId){
  event.stopPropagation();
   event.preventDefault();
    let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
    let URL =  this.baseUrl + 'front/order/remove_to_wish_list';
    let data = {lang_id:this.currentLanguageData['id'],lang:this.currentLanguageData['lng_code'],slug:this.slug,sku:sku,product_id:productId,user_id:userDetail.id};
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
        this.flashMessagesService.show(response['msg'], {
          classes: ['alert', 'alert-success'], 
          timeout: 1000
        });
        let index = this.addedToWishlistProductID.indexOf(productId);
        this.addedToWishlistProductID.splice(index,1);
        this.globalDataService.addToWishListInLocalStorage(response['wishlist_detail']);
        this.userWishlistData = response['wishlist_detail'];
        this.isProductAvailableInWishList(this.productData,false);
         
         }
         else{
          
          this.flashMessagesService.show(response['msg'], {
            classes: ['alert', 'alert-danger'], 
            timeout: 1000
          });
         }
     });
 }
 navigateToSubCategory(parentItem:any,subItem:any){
  $(".header-menu-list").find(".active").removeClass("active");
  let parentCatName:string = parentItem.translation_data.length > 0?parentItem['translation_data'][0]['name']:parentItem['name'];
  let parentCatId = parentItem['_id'];
  let parentSlug = parentItem['slug'];

  let subCatName:string = subItem.translation_data.length > 0?subItem['translation_data'][0]['name']:subItem['name'];
  let subCatId = subItem['_id'];
  let subSlug =  subItem['slug'];

return subItem['cat_status']?["/"+this.relaceSpecialCharacter(parentSlug),this.relaceSpecialCharacter(subSlug)]:["/"+this.relaceSpecialCharacter(parentSlug),this.relaceSpecialCharacter(subSlug)];

}
navigateToCategory(menuItem:any){
  $(".header-menu-list").find(".active").removeClass("active");
  let catName:string = menuItem.translation_data.length > 0?menuItem['translation_data'][0]['name']:menuItem['name'];
  let catId = menuItem['_id'];
  let catSlug = menuItem['slug'];
  let catItem = {};
 let breadCrumbItem = {"data":[]};
 breadCrumbItem['data'].push(menuItem);

 return menuItem['cat_status']?["/"+this.relaceSpecialCharacter(catSlug)]:["/"+this.relaceSpecialCharacter(catSlug)];

}
//Function to open login form****************************


toggleMenu(event,attr_type){
 
 this.slideToggleRef[attr_type] = attr_type;
 if($(event.currentTarget).parent().next().is(':visible')){
   delete this.slideToggleRef[attr_type];
 }
 $(event.currentTarget).parent().next().slideToggle();
}


displayCategory(event,attr_type)
{
  this.slideToggleRef[attr_type] = attr_type;
  if($(event.currentTarget).parent().children(".brands-collection").is(':visible'))
  {
    delete this.slideToggleRef[attr_type];
  }
  $(event.currentTarget).parent().children(".brands-collection").slideToggle();
}
displayingCategory(event,attr_type)
{
  this.slideToggleRef[attr_type] = attr_type;
  if($(event.currentTarget).parent().children(".brands-collection").is(':visible'))
  {
    delete this.slideToggleRef[attr_type];
  }
  $(event.currentTarget).parent().children(".brands-collection").slideToggle();
}

hidePrice(event,attr_type)
{
  this.slideToggleRef[attr_type] = attr_type;
  if($(event.currentTarget).parent().children(".product-price").is(':visible'))
  {
    delete this.slideToggleRef[attr_type];
  }
  $(event.currentTarget).parent().children(".product-price").slideToggle();

}



/*********************************************************
 Function to show filter option inside single Attribute
 *********************************************************/

categoryShow(event,name)
{
  
  if(this.slideToggleRef[name])
  {
    delete this.slideToggleRef[name];
  }
  else
this.slideToggleRef[name] = name;
 }

/*********************************************************
 Function to show filter option inside single Attribute
 *********************************************************/
expandFilterOption(event,outerIndex,attrLabel,attr_type)
{
 
        if(this.slideToggleRef[attr_type])
        {
          delete this.slideToggleRef[attr_type];
        }
        else
  this.slideToggleRef[attr_type] = attr_type;
 }
/*********************************************************
 Function to search filter option inside Attribute
 *********************************************************/
 filterSearch(event,dataArray){
  console.log('Entered Click Event!');
  this.filterSearchkey = event.target.value;
//   if(event.keyCode == 13){
//     alert('Entered Click Event!'+event.target.value);
//  }else{
//  }
 }

//Function to check if object is empty***************************
// isEmptyObject(obj) {
//   for(var key in obj) {
//       if(obj.hasOwnProperty(key))
//           return false;
//   }
//   return true;
// }

}

