import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {appConstant} from '../constant/app.constant';
import {HttpService} from './http-service';
import { LanguageTranslateInfoService } from './app.changeLang';
@Injectable()
export class CreateUrl {
  currentLanguageData:any={};
  baseUrl:string = appConstant['baseUrl'];
   constructor(private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService){

 
  
 languageTranslateInfoService.translateInfo.subscribe((data) => {
  if(data){
             this.currentLanguageData = data;
           }
   });

    }
/****************************************************************************** 
//Function to navigate to inner Category****************************************
********************************************************************************/
 
navigateToInnerCategory(parentItem:any,subItem:any,innerItem:any)
{
  let parentCatName:string = parentItem.translation_data.length > 0?parentItem['translation_data'][0]['name']:parentItem['name'];
  let parentCatId = parentItem['_id'];
  let parentSlug = parentItem['slug'];
  let subCatName:string = subItem.translation_data.length > 0?subItem['translation_data'][0]['name']:subItem['name'];
  let subCatId = subItem['_id'];
  let subSlug= subItem['slug'];
  let innerCatName:string = innerItem.translation_data.length > 0?innerItem['translation_data'][0]['name']:innerItem['name'];

  let innerCatId = innerItem['_id'];
  let innerSlug = innerItem['slug'];

return innerItem['cat_status']?["/"+parentSlug,subSlug,innerSlug]:["/"+parentSlug,subSlug,innerSlug];
}

/****************************************************************************** 
//Function to navigate to Sub  Category****************************************
********************************************************************************/
navigateToSubCategory(parentItem:any,subItem:any)
{
  let parentCatName:string = parentItem.translation_data.length > 0?parentItem['translation_data'][0]['name']:parentItem['name'];
  let parentCatId = parentItem['_id'];
  let parentSlug = parentItem['slug'];

  let subCatName:string = subItem.translation_data.length > 0?subItem['translation_data'][0]['name']:subItem['name'];
  let subCatId = subItem['_id'];
  let subSlug =  subItem['slug'];

return subItem['cat_status']?["/"+parentSlug,subSlug]:["/"+parentSlug,subSlug];

}
/****************************************************************************** 
//Function to navigate to Root Category****************************************
********************************************************************************/
navigateToCategory(menuItem:any)
{
  let catName:string = menuItem.translation_data.length > 0?menuItem['translation_data'][0]['name']:menuItem['name'];
  let catId = menuItem['_id'];
  let catSlug = menuItem['slug'];
  let catItem = {};

 return menuItem['cat_status']?["/"+catSlug]:["/"+catSlug];
}
 
}