
import { Component, ElementRef } from '@angular/core';
import { AuthService } from "angular2-social-login";
import { HttpService } from '../../provider/http-service';
import { appConstant } from '../../constant/app.constant';
import { ModelAlertPopup } from '../../model/alert/model.alert';
import {CartDetailService } from '../../provider/cartdetail';
import { NgProgress } from 'ngx-progressbar';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { FlashMessagesService } from 'ngx-flash-messages';
import { GlobalData } from '../../provider/app.global';
declare var $: any;

@Component({
  selector: '[forget]',
  templateUrl: './app.forget.html'
})
export class ForGetPassword {
  
  user: any = {};
  isFormSubmit: boolean = false;
  baseUrl: string = appConstant.baseUrl;
  color:any = appConstant['color'];
  title:any='';
  titleStatus:boolean= false;
  cartdetailservice:CartDetailService;
  modelAlertOb:ModelAlertPopup;
  currentLanguageData:any;
 // isMessage:boolean = false;
  constructor(private globalData:GlobalData,private ngProgress: NgProgress,cartdetailservice:CartDetailService,private flashMessagesService: FlashMessagesService,private element: ElementRef, private socialAuth: AuthService, private httpService: HttpService,private languageTranslateService: LanguageTranslateInfoService) {
    this.modelAlertOb =  new ModelAlertPopup();
    this.cartdetailservice=cartdetailservice;
 languageTranslateService.translateInfo.subscribe((data) => {
              //console.log("fff="+JSON.stringify(data))
              if(data){
           this.currentLanguageData = data;
          // console.log("this.currentLanguage=="+this.currentLanguage)
              }
      });
  }
  
  openLoginPopup(){
    this.hideFogetPopUp();
    if(localStorage.getItem('userLoginDetail')==null)
    this.globalData.openPopUp(document.querySelector("#login"));
   
  }
  
 
  hideFogetPopUp() {
    ;
    this.globalData.closePopup(this.element.nativeElement);
  
}

  
  submit(isValid: boolean) 
  {
    this.isFormSubmit = true;
    
    if (!isValid)
      return
      this.ngProgress.start();
    let url = this.baseUrl+"front/user/forgot_password";
    this.user['lang'] = this.currentLanguageData['lng_code'];
    this.user['lang_id'] = this.currentLanguageData['id'];
    this.user['url'] = window.location.host+"/change-password";
   
    this.httpService.createPostRequest(url, this.user).subscribe((response: any) => {
      this.ngProgress.done();
      if(response.status)
      {
          this.titleStatus = true;
          this.title=response['msg'];
           
          // alert(this.title)
          //  this.hideFogetPopUp();
           this.user = {};
           this.isFormSubmit = false;
          
           //$("#forget").hide("slow");
           //window.location.reload();
       } 
     else{
       this.titleStatus = false;
      this.isFormSubmit = false;
      // alert(response['msg']);
      this.title=response['msg'];
     
      this.user = {};
          //  this.globalData.showToaster({type:"error",body:data['msg']}); 
         // alert(response['msg'])
       }
      //  setTimeout(()=>{
      //   this.title="";
      // },2000)
     // this.modelAlertOb.openPopup(response['msg']);
     
      // setTimeout(()=>{
          
      //     this.isMessage = false;
      //   },1000);
    
       // alert(1)
    });
    
  }
}