import { RouterModule, Routes } from '@angular/router';
import { BrowserModule,BrowserTransferStateModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgProgressModule } from 'ngx-progressbar';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { Header } from './component/header/header';
import { subMenuCategoryList } from './component/header/sub-menu-cat';
import { Footer } from './component/footer/footer';
import { GlobalData } from './provider/app.global';
import { StaticBlock } from './static-dynamic';
import {BreadCrumbs } from './component/app.component.breadCrumb';
//import { Login } from './model/login/app.login';

import { ForGetPassword } from './model/forget/app.forget';
import { FacebookLoginService } from './provider/facebook.login';
import { socialLoginConstant } from './constant/app.sociallogin.constant';
import { Angular2SocialLoginModule } from "angular2-social-login";

import {appConstant} from './constant/app.constant';
import {ModelAlertPopup} from './model/alert/model.alert';
import {Loader} from './model/loader/loader-component';
import { StaticCmsBlock } from './component/home/static-block/static-block';

import { SharedModule } from './app.shared.module';
import { MetaModule } from '@ngx-meta/core';
import { NioBreadcrumbsModule } from '@nodeableio/ngx-breadcrumbs';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { DawaAutocompleteModule } from 'ngx-dawa-autocomplete';



export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, appConstant['translateUrl'], '.json');
}

@NgModule({
  declarations: [ BreadCrumbs,
    AppComponent, Header, Footer, Loader,ModelAlertPopup,ForGetPassword,StaticBlock,subMenuCategoryList
  ],
  imports: [FlashMessagesModule,NgProgressModule,Angular2SocialLoginModule,
    BrowserModule.withServerTransition({appId:'superKlick'}),BrowserTransferStateModule, FormsModule,
    AppRoutingModule, HttpModule, CommonModule,MetaModule.forRoot(),SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),NioBreadcrumbsModule.forRoot(),
    DawaAutocompleteModule.forRoot()

  ],
  providers: [FacebookLoginService,GlobalData],
  bootstrap: [AppComponent]
})
export class AppModule {
   constructor(private globalData:GlobalData){
    if(this.globalData.isBrowser){
Angular2SocialLoginModule.loadProvidersScripts(socialLoginConstant);
    }

  }
 }

