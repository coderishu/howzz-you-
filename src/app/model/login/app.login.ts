
import { Component, ElementRef } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { AuthService } from "angular2-social-login";
import { HttpService } from '../../provider/http-service';
import { appConstant } from '../../constant/app.constant';
import { ModelAlertPopup } from '../../model/alert/model.alert';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { EncriptData } from '../../provider/encription';
import { FacebookLoginService } from '../../provider/facebook.login';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GlobalData } from '../../provider/app.global';
import { NgProgress } from 'ngx-progressbar';
import {CartDetailService } from '../../provider/cartdetail';
import { FlashMessagesService } from 'ngx-flash-messages';
import { StoreSetting } from '../../provider/app.store-setting';
declare var $: any;

@Component({
  selector: '[login]',
  templateUrl: './app.login.html'
})
export class Login {
  socialLoginRef: any;
  loginUser: any = {};
  isFormSubmit: boolean = false;
  title:any='';
  globalData:GlobalData;
  color:any = appConstant['color'];
  baseUrl: string = appConstant.baseUrl;
  modelAlertOb:ModelAlertPopup;
  currentLanguageData:any;
  msgStatus:boolean = false;
  storeData:any;

  constructor(private router : Router,private facebookOb:FacebookLoginService,private storeSettingService:StoreSetting,globalData:GlobalData,private ngProgress: NgProgress,private flashMessagesService: FlashMessagesService,private cartdetailservice:CartDetailService,private encryption:EncriptData,private element: ElementRef, private socialAuth: AuthService, private httpService: HttpService,private languageTranslateService: LanguageTranslateInfoService)
   {
    this.globalData = globalData;
    this.modelAlertOb =  new ModelAlertPopup();
 languageTranslateService.translateInfo.subscribe((data) => {
            if(data){
           this.currentLanguageData = data;
         }
      });
      this.checkIsRemember();

       /****** for store Setting *****/
       storeSettingService.apiSettingsData.subscribe((data) => {
        this.storeData = data;
        
       });
  }

  //Function for remember me ************************
  checkIsRemember(){
    
     if(this.globalData.isBrowser && Cookie.get('isRemember'))
     {
       this.loginUser.email=Cookie.get('email');
       this.loginUser.password=Cookie.get('password');
       this.loginUser.isRemember=Cookie.get('isRemember');
    }
   
   }
  closeLoginModel() {
   this.globalData.closePopup(this.element.nativeElement);
  }
  openForgetPopUp(){
    this.closeLoginModel();
    this.globalData.openPopUp(document.querySelector("#forget"));
    
    
  }
  openRegisterModel(event) {
     this.closeLoginModel();
    this.globalData.openPopUp(document.querySelector("#register"));
   
   
    
  }
   logOut() {
     
    this.socialAuth.logout().subscribe(
      (data) => { }
    );
  }
  socialLogin(socialType: string) {
    this.socialAuth.login(socialType).subscribe((authRes: any) => {
    let userData = {'email':authRes['email'],'password':'','type':'social','social':JSON.stringify(authRes)}
    });

  }
  facebookLogin(type){
    this.facebookOb.fbLogin((response)=>{
     console.log(JSON.stringify(response))
    })
  }
  validateLogin(isValid: boolean)
   {
    this.isFormSubmit = true;
    if (!isValid)
      return
      this.ngProgress.start();
    this.loginUser['type'] = 'normal';
    if(this.loginUser.isRemember)
    {
      Cookie.set('email',this.loginUser.email);
      Cookie.set('password',this.loginUser.password);
      Cookie.set('isRemember',this.loginUser.isRemember);
    }
    else{
      Cookie.set('email',"");
      Cookie.set('password',"");
      Cookie.set('isRemember',"");
    }
    this.login(this.loginUser);   
   // $(".login-info").css("display", "none"); 
    
  }
  login(userData:any){
    userData['lang'] = this.currentLanguageData['lng_code'];
    userData['lang_id'] = this.currentLanguageData['id'];  
    let url = this.baseUrl + "front/user/login";
   this.httpService.createPostRequest(url, userData).subscribe((response: any) => { 
    this.ngProgress.done();
      if(response['status'] == true)
      {
       this.msgStatus= true;
        this.title = response['msg'];
        let decriptData = response['data'];
        localStorage.setItem("userLoginDetail",JSON.stringify(decriptData));
        this.globalData.addToWishListInLocalStorage(response['data']['wishlist_detail']);
       
        /**************************UPDATE CART******************************************/
        let browser_id = Cookie.get('browser_id');
        let URLtosend =  this.baseUrl+'front/basket/update_cart';
        let dataTOsend = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],user_id:response.data.id,session_id:browser_id};
        this.httpService.createPostRequest(URLtosend,dataTOsend).subscribe(data=>{
            if(data.status){
                this.cartdetailservice.userExist = true;
                this.isFormSubmit = false;
                this.loginUser = {};
                this.router.navigate([""]);
                   setTimeout(()=>{
                   window.location.reload();
                },500)
             }
         });
         /*********************************************************************/
      }
      else{
        this.msgStatus= false;
        this.title=response['msg']
        this.loginUser = {};
        this.isFormSubmit = false;
        }
      
   });
  }
 
}