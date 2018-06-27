import{Component,OnInit,Input} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Meta,Title} from '@angular/platform-browser';
//import { BreadCrumbs } from '../../provider/app.breadcrum';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { UrlBreadCrumbService } from '../../../provider/app.urlbreadcrum';
import { StoreSetting } from '../../../provider/app.store-setting';
import { CreateUrl } from '../../../provider/createUrl';
import { manageCategoryProductService } from '../../../provider/manageCategoryProduct';
import { GlobalData } from '../../../provider/app.global';
//import {DataService} from '../../services/http-service';

declare var $:any;

@Component({

    selector:'category',
    templateUrl:'./category.html',
     //providers: [DataService]
})
export class Category implements OnInit{
   // @Input("categoryStatus")categoryStatusofCurrentItem:any;
     currentLanguageData:any;
     baseUrl:string = appConstant['baseUrl'];
     categoryData:any;
     categoryBrandData:any = new Array();
     categoryId:string;
     isCategoryPage:string = 'category';
     //breadCrumbs:Array<any> = [];
    //  parentCatNavigateStatus = localStorage.getItem("parent_cat_status");
    //  subCatNavigateStatus = localStorage.getItem("sub_cat_status");
    //  innerCatNavigateStatus = localStorage.getItem("inner_cat_status");
     breadCrumData:any = {};
     slug:any;
     storeData:any;
    

    constructor(private globalDataService:GlobalData,private manageCategoryProduct:manageCategoryProductService,private meta : Meta,private createUrl:CreateUrl,private storesettingservice:StoreSetting,private breadCrumService:UrlBreadCrumbService,private activateRoute:ActivatedRoute,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService){
        this.router=router;

      this.manageCategoryProduct.URLInfo.subscribe((urlDetailsData)=>{
            let urlDetails = urlDetailsData['catData'];
            this.currentLanguageData = urlDetailsData['langData'];
            if(urlDetails.type == 'params' && urlDetails.cat_status == this.isCategoryPage ){
              this.navigateViaParams(urlDetails['data']);
             // alert("params>>>>>>>category"+JSON.stringify(urlDetails));
             // alert("paramsCategory"+JSON.stringify(urlDetails));
            }
            // else if(urlDetails.type == 'queryParams'){
              
            // }
          });
     
        // this.activateRoute.params.subscribe((param)=>{
        //     let keyLength = Object.keys(param).length;
        //     this.categoryId = param['catId']?param['catId']:'';
        //     this.slug = param['slug'];

        //      if(this.currentLanguageData){
        //         this.loadCategoriesData();
        //     }
        // });

        storesettingservice.apiSettingsData.subscribe((data) => {
            if(data){
              this.storeData = data.STORE.seo;
             // alert(data['STORE']['breadcrum']['catalog']);
              data['STORE']['breadcrum']['catalog'] == "1"?this.breadCrumService.toggleBreadCrumb(true):this.breadCrumService.toggleBreadCrumb(false);
             
               }
            });

          languageTranslateInfoService.translateInfo.subscribe((data) => {
    
              if(data){
                 this.currentLanguageData = data;
                 this.loadCategoriesData();
                 }
             
      
    });
     /******** for breadcrum *******/
      breadCrumService.breadcrumbInfo.subscribe((data) => {
         if(data){
               this.breadCrumData = data;
               }
         
    });
}

// ngOnChanges({categoryStatusofCurrentItem:SimpleChange}){
//     if(this.categoryStatusofCurrentItem)
//      alert("category/////////////"+this.categoryStatusofCurrentItem)
//   }

  /******************************************************************** 
 // Function for execute code when navigate from header****************
 *********************************************************************/
   
navigateViaParams(param){
        let keyLength = Object.keys(param).length;
            this.categoryId = param['catId']?param['catId']:'';
            this.slug = param['slug'];

             if(this.currentLanguageData){
                this.loadCategoriesData();
            }
        /******************get breadcrum********************** */
        this.breadCrumService.setBreadCrumbDataFromServer(this.slug,'');
}

loadCategoriesData(){
     let url = this.baseUrl + "front/webservice/subcategoryList";
     //this.categoryId = "59d71a31943851a87a97f3e5";
      let data = {"cat_id":this.categoryId,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"slug":this.slug};
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {

   
      if(response['status'] == true && response['brand_data'])
      {
           /*Meta Tag *************************************************/
            let brand_data = response.brand_data;
            let cat_basic_path = response.basic_path;
            this.meta.updateTag({name:"title",content:brand_data.page_title?brand_data.page_title:brand_data.name});
            this.meta.updateTag({name:"keywords",content:brand_data.meta_key?brand_data.meta_key:brand_data.name});
            this.meta.updateTag({name:"description",content:brand_data.meta_desc?brand_data.meta_desc:brand_data.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"og:title",content:brand_data.page_title?brand_data.page_title:brand_data.name});
            this.meta.updateTag({name:"og:image",content:brand_data.category_image?cat_basic_path+brand_data.category_image:''});
            this.meta.updateTag({name:"og:description",content:brand_data.meta_desc?brand_data.meta_desc:brand_data.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"twitter:title",content:brand_data.page_title?brand_data.page_title:brand_data.name});
            this.meta.updateTag({name:"twitter:description",content:brand_data.meta_desc?brand_data.meta_desc:brand_data.short_desc.replace(/(<([^>]+)>)/ig,"")});
            this.meta.updateTag({name:"twitter:image",content:brand_data.category_image?cat_basic_path+brand_data.category_image:''});
             /*********************************************************** */
           //  this.breadCrumService.setBreadCrumbDataFromServer(brand_data['_id']);
             this.categoryData = response;
           //  this.breadCrumService.breadCrumbMenuData.subscribe((breadCrumbData)=>{
               //  if(breadCrumbData){
                    // console.log("breadCrumbData+++++++++++++++++++++++++++++++");
                    //console.log(JSON.stringify(breadCrumbData));
                    // if(response['brand_data']['Sub_cat'].length>0){
                    //     response['brand_data']['Sub_cat'].map((menuItem,index)=>{
                    //         menuItem['urlLink'] = this.createUrl.navigateToCategory(menuItem);
                    //         if(menuItem['Sub_cat'].length>0){
                    //         menuItem['Sub_cat'].map((subCat,innerIndex)=>{
                    //             subCat['urlLink'] = this.createUrl.navigateToSubCategory(menuItem,subCat)  
                    //         });
                    //        }
                    //     });
                    // }
                    
                    // this.categoryBrandData = response['brand_data'];
               //  }
                 
            // });
            if(response['brand_data']['Sub_cat'].length>0){
                response['brand_data']['Sub_cat'].map((menuItem,index)=>{
                    menuItem['urlLink'] = this.createUrl.navigateToCategory(menuItem);
                    if(menuItem['Sub_cat'].length>0){
                    menuItem['Sub_cat'].map((subCat,innerIndex)=>{
                        subCat['urlLink'] = this.createUrl.navigateToSubCategory(menuItem,subCat)  
                    });
                   }
                });
            }
            
            this.categoryBrandData = response['brand_data'];
         
     
     }
     
  });
   
}
// showProductList(catItem:any){

//     let breadCrumItem = this.breadCrumData['data'];
//     let newCatName  = catItem.translation_data.length > 0?catItem['translation_data'][0]['name']:catItem['name'];
//     let newCatNameId  = catItem['_id'];
//     let catName:string = '0';
//     let subCatName:string = '0';
//     let innerCatName:string = '0';
//     let catId:number = 0;
//     let subCatId:number = 0;
//     let innerCatId:number = 0;
//     let urlString:string;
//     let urlData:Array<any> = [];
//     if(breadCrumItem.length > 0){
//       catName = breadCrumItem[0].translation_data.length > 0?breadCrumItem[0]['translation_data'][0]['name']:breadCrumItem[0]['name'];
//        //urlData.push(catName);
//       catId = breadCrumItem[0]['_id'];
//     }
    
//      if(breadCrumItem.length > 1){
//       subCatName = breadCrumItem[1].translation_data.length > 0?breadCrumItem[1]['translation_data'][0]['name']:breadCrumItem[1]['name'];
//       //urlData.push(subCatName);
//       catId = breadCrumItem[0]['_id'];
//      }
//      if(breadCrumItem.length > 2){
//        innerCatName = breadCrumItem[2].translation_data.length > 0?breadCrumItem[2]['translation_data'][0]['name']:breadCrumItem[2]['name'];
//        urlData.push(innerCatName);
//        catId = breadCrumItem[0]['_id'];
//      }
     
    
//      this.router.navigate([catName,subCatName,innerCatName,newCatName,newCatNameId]);
//       this.breadCrumData['data'].push(catItem);
//      localStorage.setItem("breadCrum",JSON.stringify(this.breadCrumData));
//      this.breadCrumService.change(this.breadCrumData);
  
// }



ngOnInit(){
//      text: string = "view";
// $('.category.selected').text()
}
//  ngAfterViewInit(){
//     var value=$('.category.selected').text();
//     console.log(value)
//     console.log(this.redirectService.redirect_menucategory().current_page)
//     }

//Function to remove category_status from local storage ***************************
removeCatStatus(){
    if(this.globalDataService.isBrowser)
    localStorage.removeItem('category_status');
}

}