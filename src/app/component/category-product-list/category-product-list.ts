import{Component,OnInit,HostListener,HostBinding } from '@angular/core';
import{Router,ActivatedRoute,Params,NavigationStart} from '@angular/router';
import{ElementRef} from '@angular/core';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { HttpService } from '../../provider/http-service';
//import { BreadCrumbs } from '../../provider/app.breadcrum';
import {appConstant} from '../../constant/app.constant';
import * as jQuery from 'jquery';
//import '../../../assets/js/enscroll.js';

import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../provider/app.store-setting';
import { GlobalData } from '../../provider/app.global';
import { SortingKeywordsService } from '../../provider/sortingkeywords';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import { NgProgress } from 'ngx-progressbar';
import { FlashMessagesService } from 'ngx-flash-messages';
import { manageCategoryProductService } from '../../provider/manageCategoryProduct';


declare var $:any;
//declare var jQuery:any;

@Component({
    selector:'ng-view',
    templateUrl:'./category-product-list.html',
    providers:[SortingKeywordsService]
})

export class CategoryProductList{
  activatedRoute:ActivatedRoute;
  type:string;
  breadCrumData:any = {};
  urlBreadcrumbService:UrlBreadCrumbService;
 currentLanguageData:any = {};
  queryParams:any;
  slug:any;
  catDetail:any;
 // storeSettings:any= {};
  categoryStatus:string = '';
  activatedRoute_queryParams_data:any={};
  activatedRoute_params_data:any={};
  isLoadingFirst:boolean = true;
  manageCatProductJSON:any ={};
  getCatStatus:boolean = false;
   
constructor(private manageCategoryProduct:manageCategoryProductService,private flashMessagesService: FlashMessagesService,private ngProgress: NgProgress,sortingkeywordsService:SortingKeywordsService,urlBreadcrumbService:UrlBreadCrumbService,private currencyconvertservice:CurrencyConvertService,activatedRoute:ActivatedRoute,private globalDataService:GlobalData,private storeSettingOb:StoreSetting,private breadCrumService:UrlBreadCrumbService,private router:Router,private activateRoute:ActivatedRoute,private element: ElementRef,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
{
 
  this.activatedRoute = activatedRoute;
  this.urlBreadcrumbService=urlBreadcrumbService;

  this.activatedRoute.params.subscribe((params: Params) => 
  {
   
    if(Object.keys(params).length>0)
    {
      this.categoryStatus = '';
      this.manageCatProductJSON = {};
      this.manageCatProductJSON['data'] = params;
      this.manageCatProductJSON['type'] = 'params';
     this.slug = params['slug'];
      if(!this.isLoadingFirst)
      {
        this.getCatDetails();
      }
   
   }

 
  });
  this.activatedRoute.queryParams.subscribe(params =>
    {
     if(Object.keys(params).length>0)
     {
      this.categoryStatus = '';
      this.manageCatProductJSON = {};  
     this.slug = "GLOBALSEARCH";
     this.manageCatProductJSON['data'] = params;
     this.manageCatProductJSON['type'] = 'queryParams';
     if(!this.isLoadingFirst){
      this.getCatDetails();
      }
    }
    }); 

  languageTranslateInfoService.translateInfo.subscribe((data) =>
  {
     if(data)
      {
        this.currentLanguageData = data;
        if(this.isLoadingFirst)
        this.getCatDetails();
      }
  });

 
  }

  // Function to get Category Status *******************
  getCatDetails(){
    this.getCatStatus = false;
    let url = appConstant.baseUrl + "front/category/get_cat_data_by_slug";
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"slug":this.slug};
   this.httpService.createPostRequest(url,data).subscribe((response: any) => {
    this.isLoadingFirst = false;
     if(response.status)
     {
      this.catDetail = response.data;
      this.categoryStatus = 'product';
      this.getCatStatus = true;
      this.manageCatProductJSON['cat_status'] = this.categoryStatus;
      this.manageCategoryProduct.change({'catData':this.manageCatProductJSON,'langData':this.currentLanguageData});
     }
     
    });
  }

 
}

