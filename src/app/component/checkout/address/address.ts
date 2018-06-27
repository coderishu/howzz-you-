import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter,ViewChild} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
import { HttpService } from '../../../provider/http-service';
import {OrderService } from '../../../provider/order';
import {Meta,Title} from '@angular/platform-browser';
import {PaymentInfoService } from '../../../provider/paymentInfo';
import { NgForm } from '@angular/forms';

import { StoreSetting } from '../../../provider/app.store-setting';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GlobalData } from '../../../provider/app.global';
declare var $:any;
declare var bootbox:any;
@Component({
    selector:'address',
    templateUrl:'./address.html'
})

export class Address implements OnChanges{
    @Input('currentLanguageData') currentLanguageData:any;
    @Input('userExist') userExist:any;
    @Input('user') user:any;
    @Input('continueButtonStatus') continueButtonStatus:any;
    @Input('isFirst') isFirst:any;
    @Output('isFirstChanged')isFirstChanged = new EventEmitter();
    @Output('needToloadCartDetails')needToloadCartDetails = new EventEmitter();
    @Output('isAddressExist')isAddressExist = new EventEmitter();
   // @Input('isAddressAvailablefromParent') isAddressAvailablefromParent:any;
    @ViewChild(NgForm) form;
    addressDetail:any = new Array();
    isAddressAvailable:boolean = true;
    baseUrl:string = appConstant['baseUrl'];
    storeData:any={};
    productAvailabilityArr:any=[];
    errormsg_not_available:boolean=false; 
    cartlength:any;
    showShippingForm:boolean = false;
    showBillingForm:boolean = false;
    showonlyShipping:boolean = true;
    showRadioButton:boolean = true;
    countryData:any=[];
    addressFormData:any={"country":'',"state":'',"bcountry":'',"bstate":''};
    countrySelected:boolean=false;
    stateData:any=[];
    bstateData:any=[];
    isFormSubmit:boolean=false;
    addressEditflag:boolean =false;
    address_editID:any;
    nextSection:any=appConstant['SHIPPING'];
    formValid:any={};
    isFormValid:boolean=false;
    isValidForm:boolean=true;
  

    constructor(private globalDataService:GlobalData,private paymentinfoservice : PaymentInfoService,private meta:Meta,private storeSettingService:StoreSetting,private orderservice:OrderService,private router:Router,private languageTranslateInfoService:LanguageTranslateInfoService,private httpService:HttpService)
    {
      
        this.router=router;
       
          /****** for store Setting *****/
          storeSettingService.apiSettingsData.subscribe((data) => {
            if(data){
                this.storeData = data.STORE.seo;
            }
        });
        
    }

	ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
     if(Object.keys(this.currentLanguageData).length>0){
        this.getAddress();
        this.getCountryList();
      }
  }
// ngAfterViewInit(){
//   alert(this.form.valid);
// }

isFirstChangeValue(changedobj){
 let value = changedobj.data;
 this.isFirstChanged.emit({'data':value});
}

 // Function for checked Address****************
 addressChecked(checked_address_id){
   
    if(Cookie.get('browser_id')){
      var browser_id = Cookie.get('browser_id');
    }
     let URL =  this.baseUrl+'front/basket/updatezipcode_changeaddress';
     let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],
                  "id":checked_address_id,"user_id":this.user.id,"session_id":browser_id};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
          this.orderservice.defaultAdress = response.data.id;
          localStorage.setItem('isAddresschecked',response.data.id);
          if(this.orderservice.defaultAdress && !this.continueButtonStatus['msg'] ){
           // alert(this.continueButtonStatus['msg'])
            this.continueButtonStatus['status'] = 'false';
            this.continueButtonStatus['msg'] = '';
           }
          //alert( response.data.id);
          this.needToloadCartDetails.emit({'data':response.data.id,'status':'true'});
         }
      });
   
   }

//Function to get Address of currenct user*************************
getAddress(){
    if(this.userExist){
       let URL =  this.baseUrl+'front/user/get_address';
      let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"user_id":this.user.id};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
         // alert(this.addressDetail.length);
          this.addressDetail = response.data;
          if(this.addressDetail.length > 0)
          this.isAddressAvailable = true;
          else{
            this.isAddressAvailable = false;
            this.showRadioButton =  true;
            this.showShippingForm = true;
            this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
            this.showBillingForm = false;
          }
         this.isAddressExist.emit({'data':this.isAddressAvailable});

         this.orderservice.TotalAddressLength = response.data.length; 
          for(let g = 0;g<this.addressDetail.length;g++){
            if(this.globalDataService.isBrowser)
            localStorage.removeItem("isAddresschecked");
           
              if(this.addressDetail[g]['is_default']==1){
                if(this.globalDataService.isBrowser)
                 localStorage.setItem('isAddresschecked',this.addressDetail[g].id)
                 this.orderservice.defaultAdress = this.addressDetail[g].id;
                 this.addressChecked(this.addressDetail[g].id);
               }
          
           }
           
           if(!this.orderservice.defaultAdress && this.isAddressAvailable){
            this.continueButtonStatus['status'] = 'true';
            this.continueButtonStatus['msg'] = 'Please choose Address';
           }
          else if(this.isAddressAvailable==false){
            this.continueButtonStatus['status'] = 'true';
            this.continueButtonStatus['msg'] = 'Please create Address';
          }
         }
      });
    }
  }

   //Function to get country list*************************************
   getCountryList(){
    let URL =  this.baseUrl+'front/webservice/country_list';
    let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
       if(response.status){
         this.countryData = response.data;
         }
     });
   }

      //Function  for get State of any country***************************
      getStateList(event,c_id,type){
       
        let country_id;
        if(c_id==0){
         country_id = event.target.value;
        }
        else{
         country_id = c_id.toString();
        }
      this.countrySelected = true;
      let URL =  this.baseUrl+'front/webservice/state_list';
       let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"id":country_id};
       this.httpService.createPostRequest(URL,data).subscribe(response=>{
          if(response.status){
            if(type=='shipping')
            this.stateData = response.data;
            else if(type=='billing')
            this.bstateData = response.data;
          }
        });
      }

  //Function to show Shipping Form ***********************************
  showShipping(){
    //alert(111111);
      this.orderservice.defaultAdress = '';
     this.showRadioButton =  true;
     this.showShippingForm = true;
     this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
     this.showBillingForm = false;
   
  }
 //Function for show billing Address********************************
  billingAddress(){
  this.showonlyShipping = !this.showonlyShipping;
  this.showBillingForm =  !this.showBillingForm;
  this.isFormSubmit = false;
 
 }

 CancelAddressForm(){
   if(this.addressEditflag)
   this.addressEditflag = false
  // if(!this.isAddressAvailable) {
  //   this.showRadioButton =  true;
  //   this.showShippingForm = true;
  //   this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
  //   this.showBillingForm = false;
  // }
  // else{
    this.showShippingForm = false;
    this.showonlyShipping = true;
 // }
 
 
}

//Function for hide billing Address*********************************
hideBillingForm(event){
  this.showBillingForm = false;
  this.showShippingForm = true;
  this.showonlyShipping = true;
 }

  //function to save address form data******************************
  
  saveAddress(isValid,isBilling){
  this.isFormSubmit = !isValid;
  //if(this.isFormSubmit)
    //return false;
     if(!this.isFormSubmit){
      if(this.addressEditflag){
         let URL =  this.baseUrl+'front/user/update_address';
         this.addressFormData['lang']=this.currentLanguageData['lng_code'];
         this.addressFormData['lang_id']= this.currentLanguageData['id'];
         this.addressFormData['user_id']= this.user.id;
         delete this.addressFormData["land_mark"];
         this.httpService.createPostRequest(URL,this.addressFormData).subscribe(response=>{
           if(response.status){
             
             this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
             this.addressEditflag = false;
             //alert(response.msg);
            // this.globaldata.showToaster({type:'success',body:response.msg});
             this.showShippingForm = false;
             this.showBillingForm = false;
            // this.needToloadCartDetails.emit({'data':'','status':'true'});
             this.getAddress();
             }
         });
       }
       else{
         let URL =  this.baseUrl+'front/user/add_address';
         this.addressFormData['is_billing']= isBilling;
         this.addressFormData['lang']=this.currentLanguageData['lng_code'];
         this.addressFormData['lang_id']= this.currentLanguageData['id'];
         this.addressFormData['user_id']= this.user.id;
        
         this.httpService.createPostRequest(URL,this.addressFormData).subscribe(response=>{
           if(response.status){
            
             this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
           //  this.globaldata.showToaster({type:'success',body:response.msg});
          // alert(response.msg);
             this.showShippingForm = false;
             this.showBillingForm = false;
            // this.needToloadCartDetails.emit({'data':'','status':'true'});
             this.getAddress();
             }
         });
       }
     }
   
 
  }

  
  //function to remove address form data******************************
  removeAddress(address_id){
    if (confirm('Are you sure you want to delete?')) {
      let URL =  this.baseUrl+'front/basket/remove_address';
      let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:address_id,user_id:this.user.id};
      
       this.httpService.createPostRequest(URL,data).subscribe(response=>{
         if(response.status){
           if(this.address_editID==address_id){
             if(this.addressEditflag)
             this.addressEditflag= false;
             this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
           }
           if(localStorage.getItem('isAddresschecked')==address_id){
            localStorage.removeItem('isAddresschecked');
           }
           this.getAddress();
           this.needToloadCartDetails.emit({'data':'','status':'true'});
           }
       });
  } 
  // else {
     
  // }
    
    //alert(1111);
//     bootbox.confirm({ 
//       size: "small",
//       title: appConstant.title,
//       message: "appConstant.confirmationMessage", 
//       callback: (result)=>{ 
//       if(result){
//       let URL =  this.baseUrl+'front/basket/remove_address';
//         let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],id:address_id,user_id:this.user.id};
        
//          this.httpService.createPostRequest(URL,data).subscribe(response=>{
//            if(response.status){
//              if(this.address_editID==address_id){
//                if(this.addressEditflag)
//                this.addressEditflag= false;
//                this.addressFormData = {"country":'',"state":'',"bcountry":'',"bstate":''};
//              }
//              if(localStorage.getItem('isAddresschecked')==address_id){
//               localStorage.removeItem('isAddresschecked');
//              }
//              this.getAddress();
//              this.needToloadCartDetails.emit({'data':'','status':'true'});
//              }
//          });
//      }
//    }
// });
}
  //function to edit address form data******************************
  getAddressbyID(address_id){
    this.showRadioButton = false;
   // this.showCancelButton = true;
    if(!this.showShippingForm)
    this.showShippingForm = true;
    if(this.showBillingForm)
    this.showBillingForm = false;

     let URL =  this.baseUrl+'front/user/get_address_by_id';
     let data = {lang:this.currentLanguageData['lng_code'],lang_id:this.currentLanguageData['id'],address_id:address_id};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
        this.addressFormData={"country":response.data.country,"state":response.data.state,"bcountry":'',"bstate":''};
        this.getStateList('event',response.data.country,'shipping');
       
          if(response.data.is_billing){
            this.showBillingForm = response.data.is_billing;
            this.addressFormData={"country":response.data.country,"state":response.data.state,"bcountry":response.data.bcountry,"bstate":response.data.bstate};
            this.getStateList('event',response.data.bcountry,'billing');
          }
          this.addressFormData = response.data;
          this.addressFormData['address_id'] = response.data.id;
          this.addressFormData['landmark']= response.data['land_mark'];
        //  delete this.addressFormData["land_mark"];
          this.address_editID = response.data.id;
          this.addressEditflag= true;
        
          }
      });
     }
  
}