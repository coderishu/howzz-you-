import { Component, OnInit } from '@angular/core';
import { StoreSetting } from '../../../../provider/app.store-setting';
import {UserInfoService } from '../../../../provider/userInfo';
import {Router} from '@angular/router';
import { appConstant } from '../../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../../provider/app.changeLang';
import { HttpService } from '../../../../provider/http-service';
import { GlobalData } from '../../../../provider/app.global';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html'
 // styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  user:any={};
  currentUrl:any;
  userfav_count:any;
  userExist:boolean=false;
  userinfoservice:UserInfoService;
  currentUrlArr:any=[];
  currentLanguageData:any={};
  isRtl:boolean=false;
  storeData:any;

    constructor(private globalDataService:GlobalData,private storeSettingService:StoreSetting,private languageTranslateService:LanguageTranslateInfoService,private router:Router,private httpService:HttpService, userinfoservice:UserInfoService) 
    {
      this.userinfoservice = userinfoservice;
      this.languageTranslateService=languageTranslateService;
     
      this.router = router;
     
      this.currentUrlArr = this.router.url.split('/');

      languageTranslateService.translateInfo.subscribe((data) => {
        //console.log("fff="+JSON.stringify(data))
        if(data){
        this.currentLanguageData = data;
        if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
            this.isRtl = true;
        }
        else
        this.isRtl = false;
        // this.getAddress();
        this.getWishList();
    // console.log("this.currentLanguage=="+this.currentLanguage)
        }
  });
      if(this.currentUrlArr.length>1)
      this.currentUrl =  this.currentUrlArr[1];
      if(this.globalDataService.isBrowser){
         if(localStorage.getItem('userLoginDetail')){
        this.user = JSON.parse(localStorage.getItem('userLoginDetail')) ;
        this.userExist=true;
      }
      }
     

       // Get Store Setting Data **************************
       this.storeSettingService.apiSettingsData.subscribe((data)=>{
        this.storeData = data; 
      });
    }
  ngOnInit() {
    //this.getWishList();
  }
//Function to get data of wishlist**********************
getWishList(){
  let URL =  appConstant.baseUrl+'front/order/all_wish_list';
  let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],user_id:this.user.id};
  // let encrypt_data = this.encryptionservice.encrypt_data(data);
   this.httpService.createPostRequest(URL,data).subscribe(response=>{
     if(response.status){
       this.userinfoservice.userWishlistCount = response.data.length;
     }
   });
}
 
}
