import { Component,ViewChild,ChangeDetectorRef,Inject,HostListener } from '@angular/core';
import { DOCUMENT,DomSanitizer  } from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {Home} from './component/home/home';
import { LanguageTranslateInfoService } from './provider/app.changeLang';
import {appConstant} from './constant/app.constant';
import { HttpService } from './provider/http-service';
import { StoreSetting } from './provider/app.store-setting';
import { GlobalData } from './provider/app.global';
import {CurrencyConvertService } from './provider/currencyconvert';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CartDetailService } from './provider/cartdetail';
import {UrlBreadCrumbService} from './provider/app.urlbreadcrum';
import {makeStateKey, TransferState} from "@angular/platform-browser";
declare var $:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
  // styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentLanguageData:any = {};
  breadCrumbMenuData:Array<any> = [];
 public static currencyData:any = {};
  baseUrl:string = appConstant['baseUrl'];
  isBreadCrumbEnable:boolean = false;
  lazyLoadTimeout:any;
  @HostListener("window:scroll",['$event']) function(){
    clearTimeout(this.lazyLoadTimeout)
    this.lazyLoadTimeout = setTimeout(()=>{
      this.globalData.lazyLoad();
    },
    10)
    
  }
testhtml;
    //isEnableProject:boolean=false;
  
//   test(){
// alert("fromtest");
//   }
  constructor(private sanitizer:DomSanitizer,private globalData:GlobalData,@Inject(DOCUMENT) private document: Document,private cdRef:ChangeDetectorRef,private router:Router,private urlBreadCrumbService:UrlBreadCrumbService,private cartdetailservice:CartDetailService,private currencyconvertservice:CurrencyConvertService,private globalDataService:GlobalData, private apiSettingOb:StoreSetting,private httpService:HttpService,private activateRoute:ActivatedRoute, private languageTranslateService: LanguageTranslateInfoService) {
    //globalDataService.priceCodeData = "samsssssss"
  // this.testhtml =  this.sanitizer.bypassSecurityTrustHtml('<div (click) = "test()">click keresssssssssssss </div>');
    this.activateRoute.params.subscribe((param)=>{
          // console.log("from main");
          // console.log(JSON.stringify(param));
        });
        
         
     languageTranslateService.translateInfo.subscribe((data) => {
           if(data){
           this.currentLanguageData = data;
           this.loadStoreSetting();
           
         //  this.isEnableProject = true;
           this.changeOfRoutes('event');
          // console.log("this.currentLanguage=="+this.currentLanguage)
              }
      });
      
      urlBreadCrumbService.breadCrumbMenuData.subscribe((menuItem)=>{
        this.breadCrumbMenuData = [];
       //alert("from main component"+JSON.stringify(menuItem))
         if(menuItem)
         {
        this.breadCrumbMenuData = menuItem;
       //  console.log(JSON.stringify(this.breadCrumbMenuData));
      //  console.log("this.breadCrumbMenuData=="+JSON.stringify(this.breadCrumbMenuData));
         }
     });
      urlBreadCrumbService.isBreadCrumbEnable.subscribe((status)=>{
        // if(status)
       this.isBreadCrumbEnable = status;
      //  this.cdRef.detectChanges();
        //console.log(this.isBreadCrumbEnable)
     });
 }
 changeOfRoutes(event){
   
  this.router.events.subscribe((val) => {
    
   
        if(this.globalDataService.isBrowser){
 setTimeout(()=>{
     window.scrollTo(0,0);
    },500)
    }
          
            let url = val['url'];
            //alert(url)
         // alert(appConstant['breadCrumb'][url])
           this.urlBreadCrumbService.breadCrumbMenuData.next(appConstant['breadCrumb'][url]);
          
  
          url == "/"?this.urlBreadCrumbService.toggleBreadCrumb(false):this.urlBreadCrumbService.toggleBreadCrumb(true);
         
      });
   }
 ngOnInit(){
   if(this.globalData.isBrowser)
 this.generateBrowserID();
}
ngAfterViewInit(){
 
}
 
  loadStoreSetting(){
     
      let url = this.baseUrl + "front/webservice/system_setting";
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      this.loadCurrencies();
           
      if(response['status'] == true){
      // this.languageData = response;
      this.apiSettingOb.change(response['data']);
      }
     
       // alert(1)
    });
   }
   loadCurrencies(){
    
      let url = this.baseUrl + "front/webservice/currencies";
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      this.getCartDetail();
      if(response['status'] == true && response['data'].length > 0){
        for(let i = 0; i<response['data'].length;i++){
          AppComponent.currencyData[response['data'][i]['code']] = response['data'][i];
          if(response['data'][i].default == 1){
           // alert(response['data'][i].code);
            this.currencyconvertservice.currentCurrencyData = response['data'][i];
            //console.log(this.currencyconvertservice.currentCurrencyData);
           }
          }
        this.currencyconvertservice.currencyData = AppComponent.currencyData;
       }
     
    });
   }

   
  //Function for getting basket(cart) details*************************
  getCartDetail(){
    let browser_id;
    if(this.globalData.isBrowser)
     browser_id = Cookie.get('browser_id');
    let URL =  this.baseUrl+'front/basket/get_basket_data';
    let data;
    if(this.globalData.isBrowser && localStorage.getItem('userLoginDetail')!=null){
      let user = JSON.parse(localStorage.getItem('userLoginDetail'));
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],session_id:browser_id,user_id:user.id};
    }
    else{
      data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],session_id:browser_id};
    }
    //let dataToSend = this.encryptionservice.encrypt_data(data);
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
         if(response.data.cart_data.length>0)
        this.cartdetailservice.cartdatacount = response.data.cart_data.length;
        else
        this.cartdetailservice.cartdatacount = 0 ;
       }
      
    });
   }


     //Function for generating browser ID ****************************
     generateBrowserID()
     {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
       if(Cookie.get('browser_id')==null){
           Cookie.set('browser_id',text);
        }
        
    }
 
}
