import{Component,OnChanges,SimpleChange,Input,Output,EventEmitter} from '@angular/core';
import{Router} from '@angular/router';
import {PaymentInfoService } from '../../../provider/paymentInfo';
import {appConstant} from '../../../constant/app.constant';
import { FlashMessagesService } from 'ngx-flash-messages';
// import { LanguageTranslateInfoService } from '../../../provider/app.changeLang';
// import { HttpService } from '../../../provider/http-service';
// import {CartDetailService } from '../../../provider/cartdetail';
// import {Meta,Title} from '@angular/platform-browser';
// import { StoreSetting } from '../../../provider/app.store-setting';
// import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $:any;
@Component({
    selector:'continue-button',
    templateUrl:'./continue-button.html'
})

export class ContinueButton implements OnChanges{
  @Input('nextSection') nextSection:any;
  @Output('isFirstChangeValue')isFirstChangeValue = new EventEmitter();
  @Input('continueButtonStatus') continueButtonStatus:any;
  @Input('isFirst') isFirst:any;
  @Input('isAddressAvailable') isAddressAvailable:any;
  @Input('addressEditflag') addressEditflag:any;
  
  addressExist:boolean;
  addressEdit:boolean;
  //user:any={};
  //userExist:boolean=false;
   

    constructor(private flashMessagesService:FlashMessagesService,private router:Router,public paymentinfoservice:PaymentInfoService)
    {
     
      //  if(localStorage.getItem('userLoginDetail')!=null){
      //   this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
      //   this.userExist=true;
      // }
    }
    ngOnChanges(change:{nextSection:SimpleChange,isAddressAvailable:SimpleChange,addressEditflag:SimpleChange}){
      //alert(this.isAddressAvailable+'rggggggggggggg');
      this.addressExist = this.isAddressAvailable;
      this.addressEdit = this.addressEditflag;
      if(this.nextSection){
        //alert(this.nextSection);
       // alert(this.nextSection+''+'change button ');
       
      }
     
      
    }
	
 

// Function to click ***************************
showHideSections(event,nextsection){
 this.isFirst = false;
 this.isFirstChangeValue.emit({'data':this.isFirst});
 
 if(this.continueButtonStatus['status']=='false' && this.continueButtonStatus['msg']==''){
  this.paymentinfoservice.displaySection = nextsection;
 
 }
 else if(this.continueButtonStatus['msg']!=''){
  this.flashMessagesService.show(this.continueButtonStatus['msg'], {
    classes: ['alert', 'alert-danger'], 
    timeout: 6000, 
  });
   //alert(this.continueButtonStatus['msg']);
 }

  
 // alert(this.paymentinfoservice.displaySection+''+'service');
  //this.showNextSection.emit({'current_section':nextsection});
    // $(event.currentTarget).parent(".chckout-btn-wrap").hide();
    // $(event.currentTarget).parents(".ship-wrap").find(".chkout-edit").show().attr("data-target","0");
    // $(event.currentTarget).parents(".chkout-shipping").find(".chkout-frm-wrp").css("display","none")
    // $(event.currentTarget).parents(".chkout-shipping").next(".chkout-shipping").find(".chckout-btn-wrap").show(); 
    // $(event.currentTarget).parents(".chkout-shipping").next(".chkout-shipping").css("display","block").find(".chkout-frm-wrp").css("display","block");
   }
    
}