import{Component,SimpleChange,OnChanges,HostListener} from '@angular/core';
import{Router} from '@angular/router';
import { HttpService } from '../../provider/http-service';
import { appConstant } from '../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import { GlobalData } from '../../provider/app.global';
import { StoreSetting } from '../../provider/app.store-setting';
declare var $:any;
// import {DataService} from '../../services/http-service';

@Component(

    {
        selector:'footer',
        templateUrl:'./footer.html',
        // providers: [DataService]
    }
)
export class Footer {
    storeData:any={};
    isFormSubmit:boolean = false;
    blockContent:any = {};
    paymentTypeStaticBlock = {};
    staticBlocksData:any = {};
    subScriptionData:any = {}
    baseUrl:string = appConstant['baseUrl'];
    currentLanguageData:any;
    staticBlockName:string = "cms_data";
    staticBlockAboutMall:string = "about_mall";
    staticBlockContactInformation:string = "contact_information";
    message:any='';
    faceBookLink:string = appConstant['socialLink']['facebook'];
    twitterLink:string = appConstant['socialLink']['twitter'];
    linkedinLink:string = appConstant['socialLink']['linkedin'];
    systemSettingData:any;
    staticBlockPaymentFooter:string = "payment_footer";
    storeDataRcd:boolean = false;
    userDetail:any;
    // dataServices:DataService;
//    @HostListener("window:scroll") function(){
   
   
//   };
    constructor(private router:Router, private storeSettingService:StoreSetting,private globalDataService:GlobalData,private httpService: HttpService,private languageTranslateService: LanguageTranslateInfoService)
    {
        if(this.globalDataService.isBrowser){
              $(window).scroll(function() {
            let height = $(window).scrollTop();
            //alert(height);
            if (height > 100) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
       });
        }
      

         if(this.globalDataService.isBrowser)
          this.userDetail = JSON.parse(localStorage.getItem('userLoginDetail'))?JSON.parse(localStorage.getItem('userLoginDetail')):null;
         languageTranslateService.translateInfo.subscribe((data) => {
             if(data){
             this.currentLanguageData = data;
           }
      });
     
      // Get Store Setting Data **************************
      this.storeSettingService.apiSettingsData.subscribe((data:any={})=>{
          if(Object.keys(data).length>0){
            this.storeDataRcd = true;
            this.storeData = data;
            this.systemSettingData = data['SYSTEM'];
           // console.log(this.storeData["STORE"]["NEWSLETTER"]);
          }
        
        //alert(this.storeData);
        //console.log(JSON.stringify(this.storeData));
       // console.log(this.storeData["STORE"]["NEWSLETTER"]);
       //this.systemSettingData = data['SYSTEM'];

      });

    }


//     ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
//      // console.log(JSON.stringify(change));
//      // if(this.staticBlocksData['currentValue'])
//       // this.setBLockData();
//         this.loadStaticBlock();
// }
/*loadStaticBlock(){
   
    this.blockContent = {};
   
    
      let url = this.baseUrl + "front/webservice/get_static_block_data";
      let data = {"identifiers":this.staticBlockName,
                    "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
                   // console.log(JSON.stringify(data));
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
        this.loadPaymentType();
      if(response['status'] == true && response['static_block_data'].length > 0){
          
          this.staticBlocksData = response['static_block_data'];
          this.blockContent['id'] = this.staticBlocksData['id'];
          if(this.staticBlocksData[0]['block_data']['content'] != ""){
      this.blockContent['content'] = this.staticBlocksData[0]['block_data'][0]['content'];
      this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'][0]['block_title'];
          }
             
              else{
         this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'];
         this.blockContent['content'] = this.staticBlocksData[0]['content'];
              }
          
      }
     
       
    });
   
}

loadPaymentType(){
     //this.blockContent = {};
   
    
      let url = this.baseUrl + "front/webservice/get_static_block_data";
      let data = {"identifiers":this.staticBlockPaymentFooter,
                    "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
                   // console.log(JSON.stringify(data));
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      if(response['status'] == true && response['static_block_data'].length > 0){
          
          this.staticBlocksData = response['static_block_data'];
          this.paymentTypeStaticBlock['id'] = this.staticBlocksData['id'];
          if(this.staticBlocksData[0]['block_data']['content'] != ""){
      this.paymentTypeStaticBlock['content'] = this.staticBlocksData[0]['block_data'][0]['content'];
      this.paymentTypeStaticBlock['block_title'] = this.staticBlocksData[0]['block_title'][0]['block_title'];
          }
             
              else{
         this.paymentTypeStaticBlock['block_title'] = this.staticBlocksData[0]['block_title'];
         this.paymentTypeStaticBlock['content'] = this.staticBlocksData[0]['content'];
              }
        
      }
     
       
    });
}
*/
openSocialPopup(link){
   window.open(link);
}
    subScribe(isValid){
        this.message = '';
        this.isFormSubmit = true;
        if(!isValid){
           // setTimeout(()=>{this.isFormSubmit = false;},2000)
            return;
        }
       

        this.subScriptionData['lang'] = this.currentLanguageData['lng_code'];
        this.subScriptionData['lang_id'] = this.currentLanguageData['id'];
        this.subScriptionData['type'] = 1;  
       // type:1
        let url = this.baseUrl + "front/webservice/subscription";
        this.httpService.createPostRequest(url, this.subScriptionData).subscribe((response: any) => {
            if(response['status'] == true){
                if(this.globalDataService.isBrowser)
                localStorage.setItem("userLoginDetail",JSON.stringify(response['data']));
                this.message = response.msg;
                this.isFormSubmit = false;
                this.subScriptionData = {};
            }
            
           setTimeout(()=>{this.message = '';},2000)
        });

    }

    //Function to show Login/Register Popup*********************
    showLoginPopup(){
        $("#login").show("slow");
    } 

    //Function to navigate user according to click***************
    navigation(url){
    if(this.userDetail){
        this.router.navigate(['/account/'+url]);
       // [routerLink] = "['account/orders']" 
    }
    else
    this.showLoginPopup();
    }

    backToTop(){
        
    }

    ngAfterViewInit(){
        $('#back-to-top').click(function(){
            $('html, body').animate({scrollTop : 0},800);
            return false;
        });
    }
}
