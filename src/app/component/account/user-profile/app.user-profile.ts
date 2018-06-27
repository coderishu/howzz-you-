import {Component,OnInit} from '@angular/core';
import {Meta,Title} from '@angular/platform-browser';
import {Router,ActivatedRoute} from '@angular/router';
import {HttpService} from '../../../provider/http-service';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import {appConstant} from '../../../constant/app.constant';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {CurrencyConvertService } from '../../../provider/currencyconvert';
import {CartDetailService } from '../../../provider/cartdetail';
import {UserInfoService } from '../../../provider/userInfo';
import { GlobalData } from '../../../provider/app.global';
import { Http, RequestOptions, Headers, Response } from '@angular/http';  
import { Observable } from 'rxjs/Rx';  
//import { UserHeaderComponent } from '../../../directive/user-header/user-header.component';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { FlashMessagesService } from 'ngx-flash-messages';
import {TranslateService} from '@ngx-translate/core';
import { NgProgress } from 'ngx-progressbar';

import { StoreSetting } from '../../../provider/app.store-setting';
declare var $:any;

@(Component({selector:'child-view',templateUrl:'./user-profile.html'}))

export class UserProfile implements OnInit {
  meta : Meta;
  router:Router;
  route:ActivatedRoute;
  httpService:HttpService;
  http:Http;
  requestoptions:RequestOptions;
  headers:Headers;
  currencyconvertservice:CurrencyConvertService;
  cartdetailservice:CartDetailService;
  userInfoService:UserInfoService;
  globalData:GlobalData;
  storesettingservice:StoreSetting;
  user:any = {};
  userExist:boolean=false;
  isFormSubmit:boolean=false;
  userData:any={"country":"","state":""};
  checkbox_value:any=0;
  isChecked:boolean=false;
  fileObj:any={};
  image_url:any='';
  userDataInitial:any;
  currentLanguageData:any={};
  isRtl:boolean=false;
  storeData:any={};
  countryData:any=[];
  countrySelected:boolean=false;
  stateData:any=[];
  isLoadingFirst:boolean = true; 
  userDataRec:boolean = false;
  imagepath:any;
  color:any = appConstant['color'];
  metaImagePath:any = appConstant['logoPath'];
  day:any;
  month:any;
  year:any;
  //abc:any = {"country":"","state":""};

  myOptions: INgxMyDpOptions = {};


 
  constructor(private title:Title,private translateService:TranslateService,private ngProgress: NgProgress,private flashMessagesService: FlashMessagesService,private languageTranslateService:LanguageTranslateInfoService,http:Http,userInfoService:UserInfoService,globalData:GlobalData,storesettingservice:StoreSetting,
    cartdetailservice:CartDetailService,currencyconvertservice:CurrencyConvertService,
    meta:Meta,router:Router,route:ActivatedRoute,httpService:HttpService){
     
    setTimeout(()=>{
      this.translateService.get("pageTitle.account.profile").subscribe((res)=>{
				this.title.setTitle(res);
			 });
    },1000);
     
      let today = new Date();
    
     this.day= today.getDate()+1;
     this.month = today.getMonth()+1; //January is 0!
     this.year = today.getFullYear();

     this.myOptions = {
      // other options...
      dateFormat: 'dd/mm/yyyy',
      disableSince:{year: this.year, month: this.month, day: this.day} 
  };
  //  // ?key=test
  //   if(dd<10) {
  //     dd = '0'+dd;
  //   } 
    
  //   if(mm<10) {
  //       mm = '0'+mm;
  //   } 
  //   this.currentDate = mm + '/' + dd + '/' + yyyy;
     // alert("pro");
     this.meta = meta;
     this.router = router;
     this.route = route;
     this.http = http;
     this.httpService = httpService;
     this.languageTranslateService=languageTranslateService;
     this.currencyconvertservice = currencyconvertservice;
     this.cartdetailservice=cartdetailservice;
     this.globalData = globalData;
     this.userInfoService = userInfoService;
     this.storesettingservice = storesettingservice;
      if(this.globalData.isBrowser){
         if(localStorage.getItem('userLoginDetail')){
     
      this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
   
      this.userExist=true;
    }
      }
    
   
     languageTranslateService.translateInfo.subscribe((data) => {
      if(data){
      this.currentLanguageData = data;
      if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
          this.isRtl = true;
      }
      else
      this.isRtl = false;
      this.getCountryList();
      this.getProfileData();
     
     
   }
});

  

   

    /*for getting store setting data************************/
    storesettingservice.apiSettingsData.subscribe((data) => {
      if(data){
         this.storeData = data.STORE.seo;
       
         //*******************SET META TAGS********************************* */
        this.meta.updateTag({name:"title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"keywords",content:this.storeData.meta_key?this.storeData.meta_key:''});
        this.meta.updateTag({name:"description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"og:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"og:image",content:this.metaImagePath});
        this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
        this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title?this.storeData.page_title:''});
        this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
       this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});

         }
      });

  
  }

   // optional date changed callback
   onDateChanged(event: IMyDateModel): void {
    // date selected
}
  ngOnInit(){
  
  }
  loadEntity(){
   return '&#163';
  }
  getFile(event)
  {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (evet:any) => {
        this.image_url = evet.target.result;  
        //alert(this.image_url);    
       // console.log(this.image_url);  
        
      }
      this.fileObj = event.target.files[0];
     // console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
      // save Data to API********************************************************
      if(this.fileObj){
        let formData = new FormData();
        if(this.userData['user_id'])
        formData.append('user_id', this.userData['user_id']); 
        formData.append('user_image', this.fileObj);
       // let options = { "user_image": formData };
       // console.log(options); 
        let URL = appConstant.baseUrl+'front/user/update_user_image';
        
        this.httpService.createPostWithFile(URL,formData).then(response=>{
        if(response.status){
         // alert(response.msg);
          this.getProfileData();
        }
         });
      }
     
      //*********************************************************************** */
    }

   /* let fileList = event.target.files;  
   if (fileList.length > 0) {  
      this.fileObj = fileList[0]; 
     // console.log(this.fileObj);
    } */ 
  }
  //Function to Submit user profile changes**********************************
  onSubmit(isValid){
    //alert(isValid);
   this.isFormSubmit = !isValid;
     if(!this.isFormSubmit)
     { let DOB;
       //console.log(this.userData.dob)
       if(this.userData.dob)
        DOB = this.userData.dob.formatted;
       
       this.userData['dob'] = DOB;
      let URL = appConstant.baseUrl+'front/user/update_profile';
      this.httpService.createPostRequest(URL,this.userData).subscribe(response=>{
                if(response.status){
                  this.userInfoService.userInfo = response.data;
                  this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-success'], 
                    timeout: 1000
                  });
                  setTimeout(()=>{this.getProfileData()},1000); 
                    
                }
                else{
                  this.flashMessagesService.show(response['msg'], {
                    classes: ['alert', 'alert-danger'], 
                    timeout: 1000
                  });
                  }
                });
       }
  }

    changePasswordEnable(value){
      if(value==0){
        this.checkbox_value = 1;
        this.isChecked = true;
        this.userData['change_password'] = 1;
      }
     else{
       this.userData['current_password'] = '';
       this.userData['password'] = '';
       this.userData['confirm_password'] = '';
      this.checkbox_value = 0;
      this.isChecked = false;
      this.userData['change_password'] = 0;
     }
     
    }

    // Function to get Profile Data*****************************
    getProfileData(){
      this.ngProgress.start();
      let URL =  appConstant.baseUrl+'front/user/get_profile';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"user_id":this.user.id};
      this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status){
          this.ngProgress.done();
           this.userDataRec = true;
          // this.userData = response.data[0];
         
          let DateOfBirth = response.data[0].dob?response.data[0].dob.split('/'):"";
          //alert(Number(DateOfBirth[1]));
           this.userData['user_id'] = response.data[0].id;
           this.userData['fname'] =  response.data[0].f_name;
           this.userData['lname'] =  response.data[0].l_name;
           this.userData['email'] =  response.data[0].email;
           if(DateOfBirth.length>0)
           this.userData['dob'] = { date: { year: DateOfBirth[2], month: Number(DateOfBirth[1]), day: Number(DateOfBirth[0]) } };
           else
           this.userData['dob'] = "";
         //  this.userData['dob'] =  response.data[0].dob;
           this.userData['phone'] =  response.data[0].phone;
          // alert(response.data[0].country)
           this.userData['country'] =  response.data[0].country || "";
           this.userData['state'] =  response.data[0].state || "";;
           this.userData['city'] =  response.data[0].city;
           this.userData['user_image'] =  response.data[0].user_image;
           this.imagepath = response.image_url;
           //alert(this.imagepath);
           if(this.isLoadingFirst && this.userExist && this.userData['country'])
           this.getStateList(this.userData['country']);
           }
       });
     }
     //Function to get country list*****************************
  getCountryList(){
    let URL =  appConstant.baseUrl+'front/webservice/country_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
    // let encrypt_data = this.encryptionservice.encrypt_data(data);
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
         this.countryData = response.data;
         }
     });
   }

   //Function  for get State of any country********************
   getStateList(event){
    this.countrySelected = true;
   let country_id;
  // alert(this.isLoadingFirst);
   if(!this.isLoadingFirst)
   this.userData['state'] = "";

   if(event instanceof Object)
   country_id = event.target.value;
   else
   country_id = event;
  
   let URL =  appConstant.baseUrl+'front/webservice/state_list';
   let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],id:country_id.toString()};
  //  let encrypt_data = this.encryptionservice.encrypt_data(data);
    this.httpService.createPostRequest(URL,data).subscribe(response=>{
      if(response.status){
        this.stateData = response.data;
        this.isLoadingFirst = false;
       }
    });
  }

  // ngAfterViewInit(){
  //   $(".ngxmdp .headerlabelbtn").css('color','red');
  // }
  }
