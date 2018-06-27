import{Component,Output,EventEmitter,ViewChild,HostListener,Inject} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { DawaAutocompleteItem } from 'ngx-dawa-autocomplete';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import {appConstant} from '../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ModelAlertPopup } from '../../model/alert/model.alert';
import {CartDetailService } from '../../provider/cartdetail';
import { HttpService } from '../../provider/http-service';
import {Loader} from '../../model/loader/loader-component';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { CreateUrl } from '../../provider/createUrl';
import { StoreSetting } from '../../provider/app.store-setting';
import { AppComponent } from '../../app.component';
import { GlobalData } from '../../provider/app.global';
//import { DawaAutocompleteItem } from 'ngx-dawa-autocomplete';
//import { Susbcription } from 'rxjs/Subscription'
declare var $:any;
   
@Component(
   {
    selector:'header',
    templateUrl:'./header.html',
  
}
)
export class Header {
// dataServices:DataService;
  test:any = JSON.stringify(AppComponent.currencyData);
  baseUrl:string = appConstant['baseUrl'];
  isSubHeader:boolean = false;
  isMenu:boolean = false;
  languageData:any;
  cartdetailservice:CartDetailService;
  currentLanguageData:any;
  menuCategoriesData:any = [];
  defaultLanguageId:string = appConstant['defaultLangId'];
  subMenuIndex:number = -1;
  user:any;
  @ViewChild(Loader) loaderOb:Loader;
  currentLanguage:string;
  isMobile:boolean = false;
  breadCrumStorageData:any;
  breadCrumData:any = {};
  breadCrumMenuItem:Array<any> = [];
  pageName:string;
  storeSettings:any;
  arrayObj:any={};
  public selectedItem: DawaAutocompleteItem;
  searchVal:string = '';
  convertedcode:any;
  public searcItems:Array<any> = [];
  isBreadCrumEnabled:boolean = false;
  isUserExist:boolean = false;
  isLoader:boolean = false;
  animateSearchField:boolean=false;
  isBrowser:boolean = false;
  vendorURL:string = appConstant["vendorSubURL"];
  isMobileCategoryOpen : boolean = false;
  categoryIdActive:any;
  subCategoryIdActive:any;
    
  @HostListener("window:resize") resizeWindow()
  {
    this.checkMobileMode();
  }
  //private subscription: Susbcription;
  ltrStyle:string = `<link class = "ltr-style"  rel="stylesheet" type="text/css" href="assets/css/responsive.css" media="screen" />
 
  <link class = "ltr-style"  rel="stylesheet" type="text/css" href="assets/css/myAccount-responsive.css" media="screen" />
  <link class = "ltr-style"  rel="stylesheet" type="text/css" href="assets/css/check-out.css" media="screen" />`;
  rtlStyle = `<link class = "rtl-style"  rel="stylesheet" href="assets/css/bootstrap-rtl.css"/>
  <link class = "rtl-style" rel="stylesheet" type="text/css" href="assets/css/style-rtl.css" media="screen" />
  <link class = "rtl-style" rel="stylesheet" type="text/css" href="assets/css/responsive-rtl.css" media="screen" />
  <link class = "rtl-style" rel="stylesheet" type="text/css" href="assets/css/myAccount-rtl.css" media="screen" />
  <link class = "rtl-style"  rel="stylesheet" type="text/css" href="assets/css/myAccount-responsive-rtl.css" media="screen" />
  <link class = "rtl-style"  rel="stylesheet" type="text/css" href="assets/css/check-out-rtl.css" media="screen" />`;
   constructor(private createUrl:CreateUrl,cartdetailservice:CartDetailService,private globalDataService:GlobalData,@Inject(AppComponent) temp,private storeSettingOb:StoreSetting,private breadCrumService:UrlBreadCrumbService,private activateRoute:ActivatedRoute, private router:Router,private languageTranslateService: LanguageTranslateInfoService,private translate:TranslateService,private httpService:HttpService){
        this.router=router;
        this.cartdetailservice=cartdetailservice;
        if(this.globalDataService.isBrowser){
          this.breadCrumStorageData = localStorage.getItem("breadCrum");
           this.isBrowser = true;
        }
       // alert(cartdetailservice.userExist);
        this.router.events.subscribe((search) =>{
            if(this.globalDataService.isBrowser){
             if(search['url'] != undefined && search['url'].indexOf("search=") == -1)
          {
           this.searchVal="";
           this.searcItems = [];
          }
          else{
            this.activateRoute.queryParams.subscribe((query)=>{
                this.searchVal = query['search'];
            })
          }
            }
          
          
         });
       this.router.events.subscribe((event)=>{
       });
         breadCrumService.breadcrumbInfo.subscribe((data) => {
            if(data)
              {

              }
    });

       /****** for store Setting *****/
      storeSettingOb.apiSettingsData.subscribe((data) => {
              if(data)
              {
             this.storeSettings = data;
             //console.log("data="+JSON.stringify(this.storeSettings ))
              }
      });
        
       this.loadLanguageData();
       if(this.globalDataService.isBrowser)
       this.checkMobileMode();
       
      

      if(this.globalDataService.isBrowser && localStorage.getItem('userLoginDetail')){
        this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
        this.isUserExist = true;
      
        
        }
       languageTranslateService.translateInfo.subscribe((data) => {
              if(data)
              {
                this.currentLanguageData = data;
                this.loadMenuCategories();
              
              }
        });
   }
   openVendor(){
     window.open(this.baseUrl+this.vendorURL);
   }
   generateBrowserID()
   {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
     if(Cookie.get('browser_id')==null)
     {
         Cookie.set('browser_id',text);
      }
  }
   checkMobileMode()
   {  
     if(window.innerWidth < 768)
    this.isMobile = true;
    else
    this.isMobile = false;
    //alert(this.isMobile);
   }
   loadLanguageData()
   {
      let url = this.baseUrl + "front/webservice/get_lang_data";
    this.httpService.createGetRequest(url).subscribe((response: any) => {
      if(response['status'] == true)
      {
       this.languageData = response;
       this.setDefaultLanguages(response);
      }
    });
   }
   loadMenuCategories()
   {
      let url = this.baseUrl + "front/webservice/categoryList";
      let data = {
                    "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      if(response['status'] == true)
      {
        response.brand_data.map((menuItem,index)=>{
          menuItem['urlLink'] = this.navigateToCategory(menuItem);
          //console.log("data=="+menuItem['urlLink'])
        menuItem.Sub_cat.map((subMenu,subIndex)=>{
         // alert(1)
          subMenu['urlLink'] = this.navigateToSubCategory(menuItem,subMenu);
         // console.log("inner=="+menuItem['urlLink']);
          subMenu.Sub_cat.map((innerMenu,innerIndex)=>{
          innerMenu['urlLink'] = this.navigateToInnerCategory(menuItem,subMenu,innerMenu);
        });
        });
        
      });
      this.menuCategoriesData = response['brand_data'];
     }
});
   
}


relaceSpecialCharacter(item)
{
  return item;
  //return item.replace(/\(|\) |\s/g, "").toLowerCase();
}
navigateToInnerCategory(parentItem:any,subItem:any,innerItem:any)
{
 
 return this.createUrl.navigateToInnerCategory(parentItem,subItem,innerItem);

}
navigateToSubCategory(parentItem:any,subItem:any)
{
  //console.log("navigateToSubCategory");

  return this.createUrl.navigateToSubCategory(parentItem,subItem);
}
navigateToCategory(menuItem:any)
{
    
    return this.createUrl.navigateToCategory(menuItem);
}


toggleSubHeader(event){
  this.isSubHeader = !this.isSubHeader;
}
toggleMenu(event){
this.isMenu = !this.isMenu;
}
  setDefaultLanguages(lanData){
     let languagesData = lanData['languages'];
     let code = [];
     for(let i = 0;i<languagesData.length;i++)
     {
       code.push(languagesData[i]['lng_code']);
       if(this.globalDataService.isBrowser && localStorage.getItem("defaultLang") && languagesData[i]['lng_code'] == localStorage.getItem("defaultLang"))
       {
        this.currentLanguage = languagesData[i]['lng_code'];;
         let tempLang = Object.assign({},languagesData[i]);
         //alert("lng_code=="+tempLang['lng_flag']);
         tempLang['currencyData'] = lanData['currencyData'];
         tempLang['basic_path'] = lanData['basic_path'];
         
        this.languageTranslateService.change(tempLang);
       }
    
      else if(languagesData[i]['default_lang'] == 1)
       {
         this.currentLanguage = languagesData[i]['lng_code'];
         let tempLang = Object.assign({},languagesData[i]);
         //alert("lng_code=="+tempLang['lng_flag']);
         tempLang['currencyData'] = lanData['currencyData'];
         tempLang['basic_path'] = lanData['basic_path'];
         
        this.languageTranslateService.change(tempLang);
       }
       
     }
  
     this.translate.addLangs(code);
		   this.translate.setDefaultLang(this.currentLanguage);
       if(this.currentLanguage == appConstant['rtl']){
         if(this.globalDataService.isBrowser){
        $(".ltr-style").remove();
        $('head').append(this.rtlStyle);
         }
        
       }
  }
 
  /*changeLang(event){
    //this.loaderOb.showLoader();
    this.isLoader = true;
    let lang = event.currentTarget.value;
    localStorage.setItem("defaultLang",lang);
   //  let lang = "EN";
   
    if(this.currentLanguage == appConstant['rtl'] && $(".rtl-style").length < 1){
     
      $(".ltr-style").remove();
      $('head').append(this.rtlStyle);
    }
    else if(this.currentLanguage != appConstant['rtl'] && $(".ltr-style").length < 1 ){
     
      $(".rtl-style").remove();
       $('head').append(this.ltrStyle);
    }
    for(let i = 0;i<this.languageData['languages'].length;i++)
    {
      if(this.languageData['languages'][i]['lng_code'] == lang)
      {
        let temLangData = this.languageData['languages'][i];
        temLangData['currencyData'] = this.languageData['currencyData'];
        this.languageTranslateService.change(temLangData);
        break;
      }
    }
    this.currentLanguage = lang;
   
      this.translate.use(lang);
      //this.loaderOb.hideLoader();
      this.isLoader = false;
  }*/
  openLoginPopup(){
    if(localStorage.getItem('userLoginDetail')==null){
      this.globalDataService.openPopUp(document.querySelector("#login"));
    }
   
  }
  doLogout(){
    let URL = appConstant.baseUrl+'front/user/logout';
     this.httpService.createGetRequest(URL).subscribe(data=>{
   if(data.status){
   Cookie.delete('cookieconversion');
   this.convertedcode = '';
   localStorage.clear();
   if(Cookie.get('browser_id')!=null){
   Cookie.delete('browser_id');
   this.generateBrowserID();
  }
  this.cartdetailservice.cartdatacount = 0;
  this.cartdetailservice.userExist = false;
  this.isUserExist = false;
  this.router.navigate(['/']);
  window.location.reload();
   }
    });
 }
 wishlist(){
  this.router.navigateByUrl("/account/wishlist");
 }
 order(){
  this.router.navigateByUrl("/account/orders");
 }
  openmyaccount(){
    this.router.navigateByUrl("/account/profile");
  }

  ngAfterViewInit(){
    if(this.globalDataService.isBrowser){
       $("body").on("click",()=>{
      this.hideSuggestionBox();
    });
    }
   
   
  }
 //Function to save category status*************************************
  // saveCatgoryStatus(cat_status){
  //   localStorage.setItem("category_status",cat_status);
  // }
  

   search()
   {
   
    if(this.searchVal != '')
    {
      this.router.navigate(['search'],{ queryParams: { search: this.searchVal } });
    }
}


  getSearchSuggestion(item)
  {
	  let URL = appConstant.baseUrl+'front/promotion/product_filter';
		let dataToSend2 = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],key:item.trim()};
		this.httpService.createPostRequest(URL,dataToSend2).subscribe(response=>{
      if(response.status)
      {
        this.searcItems = response['data'];
			}
			else
			this.searcItems = [];
		})
  }
  hideSuggestionBox()
  {
	  this.searcItems = [];
  }


  /********** for aut  complete ****/

  public items: Array<any> = [];
    public highlightedIndex: number = -1;
    public selectedItem1: DawaAutocompleteItem;
 
    public onItems(items) {
     
        this.items = items;
    }
   
    public onItemHighlighted(index) 
    {
      
    this.highlightedIndex = index;
    }
    
    mouseEnter(index)
    {  //alert(111)
      
        this.onItemHighlighted(index);
   }
 
    public onItemSelected(item) 
    {
      if(this.searcItems.length > 0)
      this.searchVal = this.searcItems[this.highlightedIndex]['name']['name'];
      this.search();
      this.searcItems = [];
    }
    searchStatus:boolean = false;
    searchOnKeyPress(event)
    {
     
      setTimeout(()=>{
        if(event.which == 38 || event.which == 40)
        this.searchStatus = true;
       
        this.searchVal = $("#searchProduct").val();
       
       
      if(event.which == 13)
      {
      event.stopPropagation();
     
          
          if(this.searchVal != '')
          {
            if(this.searchStatus)
            {
             // alert(this.searcItems.length)
              if(this.searcItems.length > 0)
              this.searchVal = this.searcItems[this.highlightedIndex]['name']['name'];
            }
            
            this.searchStatus = false;
            this.search();
          }
          
          this.searcItems=[];
             
         
      }
      else if(this.searchVal != '' && this.searchVal.length >= this.storeSettings['STORE']['GLOBALSEARCH'])
       {
        this.getSearchSuggestion(this.searchVal);
      }
      else if(this.searchVal == '')
      this.searcItems = [];
    },200);
     
  }

  /******************************************************** 
  //Function to show Categories on header*******************
  **********************************************************/
 showCategories(event){
   console.log(event.target.value);
 // alert(event.target.value);
   $("#show").addClass("drop-dwn-section");
   if(this.isMobile)
   $("#show_mobilemode").addClass("slide-menu");
   if ($(".drop-dwn-section")[0] && this.isMobileCategoryOpen && this.isMobile){
    $("#show").removeClass("drop-dwn-section");
    $("#show_mobilemode").removeClass("slide-menu");
    this.isMobileCategoryOpen = false;
    } 
    else 
   this.isMobileCategoryOpen = true;
  }

  /******************************************************** 
  //Function to hide Categories on header*******************
  **********************************************************/
  hideCategories(event){
    //alert(this.isMobile);
    $("#show").removeClass("drop-dwn-section");
    if(this.isMobile)
    $("#show_mobilemode").removeClass("slide-menu");
  }
  /******************************************************** 
  //Function to show Trackorder on header*******************
  **********************************************************/
  showTrackOrder(event){
   // alert();
    $("#show_trackorder").addClass("drop-dwn-section");
  }
  /**********************************************************
  //Function to hide Trackorder on header*******************
  **********************************************************/
  hideTrackOrder(event){
    $("#show_trackorder").removeClass("drop-dwn-section");
  }

  /**********************************************************
  //Function to show login/signup on header*****************
  **********************************************************/
 showLoginSignUp(event){
  $("#show_login_signup").addClass("drop-dwn-section");
}

/**********************************************************
  //Function to hide login/signup on header*****************
  **********************************************************/
 hideLoginSignUp(event){
  $("#show_login_signup").removeClass("drop-dwn-section");
}

// Function to show active category *************************
categoryActive(catID){
  this.categoryIdActive = catID;
 }

 
 // Function to show active  sub category *******************
 subCategoryActive(subCatID){
  this.subCategoryIdActive = subCatID;
  }
}
