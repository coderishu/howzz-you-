import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { _throw } from 'rxjs/observable/throw';
import { filter, map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {appConstant} from '../constant/app.constant';
import {HttpService} from './http-service';
import { LanguageTranslateInfoService } from './app.changeLang';

@Injectable()
export class UrlBreadCrumbService {
  currentLanguageData:any={};
  baseUrl:string = appConstant['baseUrl'];
   constructor(private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService){

 this.breadcrumbInfo = new BehaviorSubject<any>(this.breadcrumbInfo);
 this.breadCrumbMenuData = new BehaviorSubject<any>(this.breadCrumbMenuData);
 this.isSaveBreadCrumb = new BehaviorSubject<any>(this.isSaveBreadCrumb);
 this.isBreadCrumbEnable = new BehaviorSubject<any>(this.isBreadCrumbEnable);
  
 languageTranslateInfoService.translateInfo.subscribe((data) => {
  if(data){
             this.currentLanguageData = data;
           }
   });

    }
  bredCrumData:Array<any> = [];
  breadCrumbCategoryData:Array<any>;
  //breadcrumbInfo:BehaviorSubject<any>;
  breadCrumbMenuData:BehaviorSubject<any>;
  isBreadCrumbEnable:BehaviorSubject<any>;
  isSaveBreadCrumb:BehaviorSubject<any>;
  breadCrumbData = [{"catName":"A","catId":'1'}];

    toggleBreadCrumb(status){
      this.isBreadCrumbEnable.next(status);
    }
    setBreadCrumbDataFromServer(slug:string,catId:string){
    
    let URL = this.baseUrl+'front/promotion/getparentcategory';
		
		let dataToSend = {"slug":slug,"cat_id":catId,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
		
		this.httpService.createPostRequest(URL,dataToSend).subscribe(data=>{
      if(data.status)
      {
        this.breadCrumbCategoryData = data['data'];
			this.breadCrumbMenuData.next(this.breadCrumbCategoryData);
     //this.breadCrumbData = 	
			}
		})
	  }
     saveBreadCrumbDataCategory(data:any,id:any){
   
    let URL =  this.baseUrl+'front/webservice/create_breadcrumb';
		
		let dataToSend = {b_id:id,data:data,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
		
		this.httpService.createPostRequest(URL,dataToSend).subscribe(data=>{
			if(data.status){
       
			this.isSaveBreadCrumb.next(data.status);
     		
			}
		})
	  }
     getBreadCrumbCategoryFromServer(id:any){
  
    let URL =  this.baseUrl+'front/webservice/get_breadcrumb';
		
		let dataToSend = {b_id:id,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
		
		this.httpService.createPostRequest(URL,dataToSend).subscribe(data=>{
			if(data.status){
      
        this.breadCrumbCategoryData = data['data']['detail'];
       
        // alert(data['detail'])
        //if(breadcrumbNewItem != null)
       // menuData.push(breadcrumbNewItem);
        //this.breadCrumbMenuData = data['data'];
			this.breadCrumbMenuData.next(this.breadCrumbCategoryData);
     //this.breadCrumbData = 
				
				
			}
		})
    }
    
  getUrl(productItem:any,queryParams){
    let newCatName  = (productItem.translation_data.length > 0?productItem['translation_data'][0]['name']:productItem['name']).replace(/\(|\)/g, "").toLowerCase();
    //console.log("queryParams=="+JSON.stringify(queryParams));
   // console.log("productItem['sku']=="+productItem['sku']);
      //newCatName = newCatName.replace(/-/g,"");
     newCatName = newCatName.replace(/, /g," ");
     newCatName = newCatName.replace(/\s\s+/g,"-");
    // newCatName = newCatName.replace(/ /g," ");
      newCatName = newCatName.replace(/ /g,"-");
      let newSku;
        if(Object.keys(queryParams).length > 0){
          newSku = queryParams['sku'];
       } 
        else
        newSku = productItem['sku'];

     //console.log("newCatName change=="+newCatName)
     // console.log("newCatName=="+newCatName)
     
      
       let urlData:Array<any> = [];
       
     // for(let i = 0;i<this.breadCrumbCategoryData.length;i++)
     // if(i == this.breadCrumbCategoryData.length-1)
     // urlData.push("/"+this.breadCrumbCategoryData[i]['name'].replace(/\(|\) |\s/g, "").toLowerCase());
      
       urlData.push("/"+newCatName);
       urlData.push(newSku);
        Object.keys(queryParams).length == 0?urlData.push("p"):urlData.push(this.encodeQueryToString(queryParams));

  // console.log("appConstant['productDetail']['associate']=="+appConstant['productDetail']['associate'])
     //  for(let i = urlData.length;i<urlLength;i++)
      // urlData.push(newCatNameId);
      urlData.push(appConstant['productDetail']['editional']);
      // urlData.push(this.encodeQueryToString(queryParams));
      //console.log("urlData=="+urlData)
       return urlData;
  }
  encodeQueryToString(query){
     //console.log("query=="+JSON.stringify(query));
     let queryString:string = '';
      Object.keys(query).map((key,index)=>{
        if(key != "isAvail" && key != "id" && key != "sku")
        index == 0?queryString += `${key}=${query[key]}`:queryString += `_${key}=${query[key]}`;
       });
       // console.log("queryString=="+JSON.stringify(queryString));
       return queryString;
   }
   encodeStringUrlToQueryParams(paramsString:string){
    let queryString:Object = {};
    let strinSplit:Array<any> = [];
    let breakedString = paramsString.split("_");
     breakedString.map((queryStringData,index)=>{
         let strinSplit = queryStringData.split("=");
           queryString[strinSplit[0]] = strinSplit[1];
     });
     return queryString;
 }
    breadcrumbInfo:BehaviorSubject<any>;
   
 change(translateData:any) {
    this.breadcrumbInfo.next(translateData);
  }

}