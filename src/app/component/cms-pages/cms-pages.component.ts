import { Component, OnInit } from '@angular/core';
import{Router,ActivatedRoute,Params} from '@angular/router';
import {appConstant} from '../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { HttpService } from '../../provider/http-service';
import { StoreSetting } from '../../provider/app.store-setting';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { GlobalData } from '../../provider/app.global';
import {Meta,Title} from '@angular/platform-browser';
declare var $:any;

@Component({
  selector: 'app-cms-pages',
  templateUrl: './cms-pages.component.html',
//  styleUrls: ['./cms-pages.component.css']
})
export class CmsPagesComponent implements OnInit {
  urlKey:any;
  currentLanguageData:any ={};
  cmsPageDetail:Object;
  storeSettings:any;
  storeData:any = {};
  metaImagePath:any = appConstant['logoPath'];
 
  constructor(private meta:Meta,private globalDataService:GlobalData,private urlBreadcrumbService:UrlBreadCrumbService,private storesettingservice:StoreSetting,private httpService:HttpService,private activatedRoute:ActivatedRoute,private languageTranslateInfoService:LanguageTranslateInfoService) 
  {
    // alert(activatedRoute.component.valueOf());
    /*for getting store setting data************************/
       storesettingservice.apiSettingsData.subscribe((data:any={}) => {
         
        if(Object.keys(data).length>0){
          this.storeSettings = data;
          this.storeData = data.STORE.seo;
          this.storeSettings['STORE']['breadcrum']['cms'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
           //*******************SET META TAGS********************************* */
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

    activatedRoute.params.subscribe((params)=>{
    // alert(JSON.stringify(params));
     if(params["pageName"]){
      this.urlKey = params["pageName"];
    //  this.urlBreadcrumbService.setBreadCrumbDataFromServer(this.urlKey,'');
      }
     });

     languageTranslateInfoService.translateInfo.subscribe((data) =>
     {
         if(data)
          {
            this.currentLanguageData = data;
             this.getCMSData();
          }
      });

    
    }

    ngOnInit() {
    }
  /************************************************************** 
  // Function to get data for CMS Pages**************************
  ***************************************************************/
 getCMSData(){
   if(this.globalDataService.isBrowser)
  $("html, body").animate({ scrollTop: 0 }, "slow");
  let url = appConstant.baseUrl + "front/webservice/get_cms_data";
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"url_key":this.urlKey};
   this.httpService.createPostRequest(url,data).subscribe((response:any)=>{
     if(response.status){
       this.cmsPageDetail = response.cms_data;
     }

   });
 }

}
