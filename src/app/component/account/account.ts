import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../provider/http-service';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../provider/currencyconvert';
import {CartDetailService } from '../../provider/cartdetail';
import {UserInfoService } from '../../provider/userInfo';
import { GlobalData } from '../../provider/app.global';
import { Http, RequestOptions, Headers, Response } from '@angular/http'; 
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum'; 

import { Observable } from 'rxjs/Rx';  
import { UserHeaderComponent } from './sharing-component/user-header/user-header.component';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';

import { StoreSetting } from '../../provider/app.store-setting';
declare var $:any;

@Component({selector:'ng-view',templateUrl:'./account.html'})

export class Account  {
  storeData:Object = {};


  constructor(private router:Router,private urlBreadcrumbService:UrlBreadCrumbService,private storesettingservice:StoreSetting){
  //  this.router.events.subscribe((events)=>{


  //  });
   /*for getting store setting data************************/
     storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
        this.storeData = data.STORE.seo;
        data['STORE']['breadcrum']['account'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
        
        //alert(this.refund_days);
         }
      });
  }
 
  }
