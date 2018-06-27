import{Component,OnDestroy} from '@angular/core';
import{Router} from '@angular/router';
import {appConstant} from '../../constant/app.constant';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang';
import {CartDetailService } from '../../provider/cartdetail';
import {Meta,Title} from '@angular/platform-browser';
import { StoreSetting } from '../../provider/app.store-setting';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpService } from '../../provider/http-service';
import {PaymentInfoService } from '../../provider/paymentInfo';
import { NgProgress } from 'ngx-progressbar';
import { UrlBreadCrumbService } from '../../provider/app.urlbreadcrum';
import { GlobalData } from '../../provider/app.global';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;
@Component({
    selector:'ng-view',
    templateUrl:'./checkout.html'
})

export class Checkout implements OnDestroy{
  
	productQuantity:number = 1;
	basketResponseRecvd:boolean = false;
	debitCard = "DEBIT";
	creditCard = "CREDIT";
	cash:string = "CASH";
	paypal:string = "PAYPAL";
	shipMethod:string;
	shipMethodExpress = "EXPRESS";
	shipMethodRegular = "REGULAR";
	currentLanguageData:any={};
	isRtl:boolean = false;
	user:any={};
	userExist:boolean=false;
	currentAddressID:any;
	cartData:any;
	storeData:any;
    productAvailabilityArr:any=new Array();
	errormsg_not_available:boolean=false; 
	color:any = appConstant['color'];
    cartlength:any;
    imagepath:any;
    errormsg:any;
    emptyCart:boolean=false;
     grandTotal:any;
    couponTransactionId:any;
	cartdata:any={};
	baseUrl:string = appConstant['baseUrl'];
	sectionValidOrNot:any;
	continueButtonStatus:any = {'status':'false','msg':''};
	isFirst:boolean=true;
	isAddressAvailable:boolean;
	typeOfCart =  localStorage.getItem("isGift")?localStorage.getItem("isGift"):undefined;
	metaImagePath:any = appConstant['logoPath'];
	


	currentSection: any = {'shipping':appConstant['SHIPPING'],'address':appConstant['ADDRESS'],'payment':appConstant['PAYMENT']};  
	//nextSection:any = appConstant['ADDRESS'];

    constructor(private title:Title,private translateService:TranslateService,private globalDataService:GlobalData,private urlBreadcrumbService:UrlBreadCrumbService,private ngProgress:NgProgress,private paymentinfoservice : PaymentInfoService,private httpService:HttpService,private storeSettingService:StoreSetting,private meta:Meta,private cartdetailservice:CartDetailService,private router:Router,private languageTranslateService:LanguageTranslateInfoService){
		this.router=router;

		 /****** for store Setting *****/
		 storeSettingService.apiSettingsData.subscribe((data) => {
			if(data){
				this.storeData = data.STORE.seo;
				data['STORE']['breadcrum']['cart'] == "1"?this.urlBreadcrumbService.toggleBreadCrumb(true):this.urlBreadcrumbService.toggleBreadCrumb(false);
			}
		});
      if(this.globalDataService.isBrowser){
					if(localStorage.getItem('userLoginDetail')){
			this.user = JSON.parse(localStorage.getItem('userLoginDetail'));
			this.userExist=true;
		  }
			}
		
		/******************for current language data****************************** */
		languageTranslateService.translateInfo.subscribe((data) => {
			if(data){
				this.currentLanguageData = data;
				
		         if(this.currentLanguageData['lng_code'] == appConstant['rtl']){
					this.isRtl = true;
				}
				else
				this.isRtl = false;
				this.getCartDetail();
				
		   }
	});
    }

   
		isFirstChanged(changobj){
			this.isFirst = changobj.data;
       
		}
		isAddressExist(address_exist){
			this.isAddressAvailable=address_exist.data;

		}

	loadCartDetailsOnChange(getObj:any)
	{
	//	alert(getObj.status+''+this.isFirst);
	  if(getObj.status || !this.isFirst)
      this.getCartDetail();
	}

	  //Function for getting basket(cart) details*************************
	  getCartDetail(){
			this.ngProgress.start();
		let browser_id = Cookie.get('browser_id');
		let URL =  this.baseUrl+'front/basket/get_basket_data';
		let data;
		if(this.userExist){
		  data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"session_id":browser_id,"user_id":this.user.id,type:this.typeOfCart};
		}
		else{
		  data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"session_id":browser_id,type:this.typeOfCart};
		}
	   
		this.httpService.createPostRequest(URL,data).subscribe((response: any) => {
			this.ngProgress.done();
		  this.cartdetailservice.cartdatacount = response.data.cart_data.length;
		  if(response.status){
			this.basketResponseRecvd = true;
			if(response.data.cart_data.length>0)
			this.emptyCart = false;
			else{
			 this.emptyCart = true;
			 this.errormsg = response.msg;
			}
			 //*******************SET META TAGS********************************* */
			 this.translateService.get("pageTitle.checkout").subscribe((res)=>{
				this.title.setTitle(res);
			 });
			 
			 this.meta.updateTag({name:"title",content:this.storeData.page_title?this.storeData.page_title:''});
			 this.meta.updateTag({name:"keywords",content:this.storeData.meta_key?this.storeData.meta_key:''});
			 this.meta.updateTag({name:"description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
			 this.meta.updateTag({name:"og:title",content:this.storeData.page_title?this.storeData.page_title:''});
			 this.meta.updateTag({name:"og:image",content:this.metaImagePath});
			 this.meta.updateTag({name:"og:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
			 this.meta.updateTag({name:"twitter:title",content:this.storeData.page_title?this.storeData.page_title:''});
			 this.meta.updateTag({name:"twitter:description",content:this.storeData.meta_desc?this.storeData.meta_desc:''});
			 this.meta.updateTag({name:"twitter:image",content:this.metaImagePath});
			
	 
			this.cartdata = response;
			//this.sendCartDetails.emit(this.cartdata);
			this.grandTotal = this.cartdata.data.grand_total;
		//	alert(this.grandTotal);
			this.couponTransactionId = response.data.coupon_transaction_id;
			this.cartlength = response.data.cart_data.length;
			
			this.imagepath = response.data.thumb_path;
		   
		  }
		  else{
			this.basketResponseRecvd = false;
			 this.paymentinfoservice.displaySection = appConstant['SHIPPING'];
			this.errormsg = response.msg;
			this.emptyCart = true;
			this.cartdata = response;
		  }
		});
	   }

  //Function for update Address ID to the Child ******************************
  changeAddress(address_id:any){
	  this.currentAddressID = address_id.address;
	  //alert(address_id);
	}
	showNextSection2(changedobj){
		//this.currentSection = changedobj.current_section;
		//alert(1);
		//alert(	this.currentSection+''+'check')
	

	}
 //Function for edit button ***************************************************
 editButton(event,current_section){
	this.paymentinfoservice.displaySection = current_section;
	//e.preventDefault() 	
	// $(event.currentTarget).parents(".chkout-shipping").find(".chkout-frm-wrp").css("display","block");
	// $(event.currentTarget).parents(".chkout-shipping").siblings(".chkout-shipping").find(".chkout-frm-wrp").css("display","none") 	
	// $(event.currentTarget).parents(".ship-wrap").find(".chckout-btn-wrap").show(); 
	// $(event.currentTarget).parents(".chkout-shipping").siblings(".chkout-shipping").find('.chkout-edit[data-target="0"]').show();
	// $(event.currentTarget).hide();
 }
 ngOnDestroy() {
	let URL = appConstant.baseUrl+'front/basket/remove_gift_coupon_card';
			let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],"user_id":this.user.id};
			this.httpService.createPostRequest(URL,data).subscribe(response=>{
			if(response.status){

			}
			
			});
	
}
}