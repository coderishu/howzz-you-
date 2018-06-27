import { Component, ElementRef,ViewChild } from '@angular/core';
import { HttpService } from '../../provider/http-service';
import {Router,ActivatedRoute} from '@angular/router';
import { appConstant } from '../../constant/app.constant';
import { ModelAlertPopup } from '../../model/alert/model.alert';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
 import {Loader} from '../../model/loader/loader-component';
import { FlashMessagesService } from 'ngx-flash-messages';
import { NgProgress } from 'ngx-progressbar';
import { GlobalData } from '../../provider/app.global';
import {CartDetailService } from '../../provider/cartdetail';
import { Cookie } from 'ng2-cookies/ng2-cookies';
declare var $: any;


@Component({
        selector: '[register]',
        templateUrl: './app.register.html'
})
export class Register {
        registerUser:any = {};
        isFormSubmit:boolean = false;
        loaderOb:Loader;
        title:any = '';
        msgStatus:boolean = false;
        // @ViewChild(Loader) loaderOb:Loader;
        baseUrl:string = appConstant.baseUrl;
        modelAlertOb:ModelAlertPopup;
        isLoader:boolean=false;
        color:any = appConstant['color'];
        currentLanguageData:any;
        constructor(private router:Router,private cartdetailservice:CartDetailService,private globalData:GlobalData,
                private flashMessagesService: FlashMessagesService,private ngProgress: NgProgress,private element: ElementRef,private httpService:HttpService,private languageTranslateService: LanguageTranslateInfoService) {
                this.modelAlertOb =  new ModelAlertPopup();
                this.loaderOb = new Loader();
                languageTranslateService.translateInfo.subscribe((data) => {
             if(data){
                this.currentLanguageData = data;
               }
            });

        }
        closeRegisterModel() {
                this.globalData.closePopup(this.element.nativeElement);
               
        }
        openLoginModel(event) {
                this.closeRegisterModel();
                this.globalData.openPopUp(document.querySelector("#login"));
                
        }
        register(isValid:boolean){
             this.isFormSubmit = true;
             if(!isValid)
                 return;
              
              this.registerUser['lang'] = this.currentLanguageData['lng_code'];
              this.registerUser['lang_id'] = this.currentLanguageData['id']; 
             let url = this.baseUrl+"front/user/register_user";
             this.ngProgress.start();
             this.registerUser['type'] = 'normal';
             this.httpService.createPostRequest(url,this.registerUser).subscribe((response:any)=>{
                this.ngProgress.done();
                         
                     if(response['status'] == true)
                     {  
                        this.title=response['msg'];
                        this.msgStatus = true;
                        localStorage.setItem("userLoginDetail",JSON.stringify(response['data']));
                        this.globalData.addToWishListInLocalStorage(response['data']['wishlist_detail']);
       
                        //******************************************************* 
                        let browser_id = Cookie.get('browser_id');
                        let URLtosend =  this.baseUrl+'front/basket/update_cart';
                        let dataTOsend = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],user_id:response.data.id,session_id:browser_id};
                        this.httpService.createPostRequest(URLtosend,dataTOsend).subscribe(data=>{
                        if(data.status){
                       
                        this.cartdetailservice.userExist = true;
                        this.router.navigate(['']);
                        window.location.reload();
                        // setTimeout(()=>{
                        //         window.location.reload();
                        //      },500)
                        this.registerUser = {};
                        this.isFormSubmit = false;
                        
                        }
                      

                        });
                        //*************************************************************** */
                           
                        //   this.closeRegisterModel();
                     }
                     else{
                        this.title=response['msg'];
                        this.msgStatus = false;
                     }
             });  

        }
}