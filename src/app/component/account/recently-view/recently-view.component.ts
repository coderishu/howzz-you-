import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {StoreSetting} from '../../../provider/app.store-setting';
import {HttpService} from '../../../provider/http-service';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import { SortingKeywordsService } from '../../../provider/sortingkeywords';
import {RecentFilter} from '../../../pipe/recent_view';
// import {EncryptionService } from '../../provider/encryption';
import { GlobalData } from '../../../provider/app.global';
import { NgProgress } from 'ngx-progressbar';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;

@(Component({
  selector:'recently-view',providers:[SortingKeywordsService],templateUrl:'./recently-view.component.html'
}))

export class RecentlyView implements OnInit {
  color:any = appConstant['color'];
  globaldata : GlobalData;
  router:Router;
  route:ActivatedRoute;
  storeSettings:any;
  httpService:HttpService;
  cartdetailservice:CartDetailService;
  // encryptionservice:EncryptionService;
  image_path:any;
  errorMsg:any;
  perPage:number = 0;
  paging:number = 1;
  sortingOrder:string='';
  isFirst:boolean=true;
  sortingkeys:any=[];
  review:any={};
  pageNo:number = 1;
  ratingIds:any=[];
  queryParams:any;
  isShow:boolean=false;
  total:number=0;
  itemstart:number=0;
  data:any=[];
  productName:any;
  currentProId:any;
  imagePath:any;
  defaultcurrency:any;
  error_msg:any;
  currencyJSON:any={};
  pagingOther:string;
  ratingStarCount:any;
  queryFilterParams:any;
  productInfo:any=[];
  userDetail:any;
  image_url:any;
  isFormSubmit:any;
  itemend:number=0;
  isProductCountShow:any=0;
  url_data:any;
currentLanguageData:any={};
  array:any={};
  isRtl:boolean=false;
  recentlyviewArr:any=[];
  recentOrder:any='low_to_high';
  recentlyDataAvailable:boolean = false;
  metaImagePath:any = appConstant['logoPath'];

  constructor(private title:Title,private translateService:TranslateService,private ngProgress: NgProgress,private sortingkeywordsService:SortingKeywordsService,private currencyconvertservice:CurrencyConvertService,private storeSettingOb:StoreSetting,private languageTranslateService:LanguageTranslateInfoService,private activateRoute:ActivatedRoute, globaldata:GlobalData,private meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.recentView").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    });
  
     this.router = router;
     this.route = route;
     this.httpService = httpService;
     this.globaldata = globaldata;
     //this.currencyconvertservice=currencyconvertservice;

   // this.recentlyviewArr =  this.sortingkeywordsService.recentlyview;
    // console.log(JSON.stringify(this.recentlyviewArr));
    
      if(this.globaldata.isBrowser){
      this.userDetail =  JSON.parse(localStorage.getItem('userLoginDetail'))?JSON.parse(localStorage.getItem('userLoginDetail')):null
      }
     this.activateRoute.queryParams.subscribe(params => {
       this.queryParams = params;
       this.queryFilterParams = {};
       Object.keys(this.queryParams).map((key)=>{
         if(key != 'ass' && key != 'id' && key != 'sku')
         this.queryFilterParams[key] = this.queryParams[key];
       });

    });
   

storeSettingOb.apiSettingsData.subscribe((data) => {
    if(data)
    {
      this.storeSettings = data;
      this.paging = this.storeSettings['STORE']['PAGING'];
      this.perPage = this.storeSettings['STORE']['recent_view']['no_of_product'];
      //this.perPage = this.storeSettings['STORE']['PERPAGE'];
    // alert(this.perPage);
      this.pagingOther = this.storeSettings['STORE']['PAGINGOTHER'];
      //this.isProductCountShow = this.storeSettings['STORE']['FILTERCOUNT'];
      this.isProductCountShow = this.storeSettings['STORE']['FILTERCOUNT'];
     
    }
});

languageTranslateService.translateInfo.subscribe((data) => {
      
  if(data){
  this.currentLanguageData = data;
  //console.log(JSON.stringify())
  if(this.currentLanguageData['lng_code'] == appConstant['rtl'])
  {
      this.isRtl = true;
  }
  else
  this.isRtl = false;
  // this.getAddress();
  this.recentviewproduct();
  }
});

  }
  showListPageWise(page)
  {
    this.pageNo = page;
    this.recentviewproduct();
    
  }
  ngOnInit()
  {
   
  }

  recently_sort(event,value)
  {
    $("body").on("click",".filter-nav li",function(){
      $('ul li.active').removeClass('active');
      $(this).closest('li').addClass('active');
    })
  this.recentOrder = value;
  }

   //Function to get product details********************
   recentviewproduct(){//page_num:number
    this.ngProgress.start();
     let URL =  appConstant.baseUrl+'front/productslide/recent_view_products';
     let browser_id = Cookie.get('browser_id');
     let userId = this.userDetail?this.userDetail['id']:null; 
     let data = {"lang_id":this.currentLanguageData['id'],"per_page":this.perPage,"page_number":this.pageNo,pagination:this.paging,"session_id":browser_id,"user_id":userId,"lang":this.currentLanguageData['lng_code']};
    //  let encrypt_data = this.encryptionservice.encrypt_data(data);

      this.httpService.createPostRequest(URL,data).subscribe(response=>{
         /*for SET Meta Tag************************/
     
           let storeData = this.storeSettings.STORE.seo;
           this.meta.updateTag({name:"title",content:storeData.page_title?storeData.page_title:''});
        this.meta.updateTag({name:"keywords",content:storeData.meta_key?storeData.meta_key:''});
        this.meta.updateTag({name:"description",content:storeData.meta_desc?storeData.meta_desc:''});
        this.meta.updateTag({name:"og:title",content:storeData.page_title?storeData.page_title:''});
        this.meta.updateTag({name:"og:image",content:this.metaImagePath});
        this.meta.updateTag({name:"og:description",content:storeData.meta_desc?storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:title",content:storeData.page_title?storeData.page_title:''});
        this.meta.updateTag({name:"twitter:description",content:storeData.meta_desc?storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});
       //********************************************* 
        this.ngProgress.done();
        if(this.paging == 1)
        {
          // this.pageNo = page_num;
          this.itemstart =((this.pageNo-1)*this.perPage)+1 ;
          this.itemend = this.perPage*this.pageNo;
        }
        this.total = response.total_record;
        if(this.total<this.itemend)
        this.itemend = this.total;
        this.imagePath = response.large_path;
        
        
        if(response.status)
        {
          this.recentlyDataAvailable = true;
          this.productInfo = response;
          this.data=response.data
          // this.image_url = response.urls.thumb_path;
         }
         else{
           this.isShow;
         }
         
      });
     
   }
  
}
