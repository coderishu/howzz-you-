import {Component,ElementRef,Renderer,ChangeDetectorRef,Input,SimpleChange,PLATFORM_ID,Inject} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';



declare var $:any;


@Component({selector: 'share-Model', 
template: `<div  class = "overlay model-share"><div  class = "model-popup-block">
<a href = "javascript:void(0)" (click) = "closeSharePopUp()" class = "close-icon"><img src = "assets/images/share-images/close-icon.png" /> </a>
<ul class="social-share">
        <li class="fb" (click) = "socialShare('.facebook')" ><a href="javascript:void(0)"></a><span class = "social-text">Facebook</span></li> 
        <li class="twitter-share" (click) = "socialShare('.twitter')"><a href="javascript:void(0)"></a><span class = "social-text">Twitter</span></li>
        <li class="mail"><a href="mailto:{{mailTo}}?subject={{subject}}&cc={{mailCC}}&body={{socialShareLink}}"><span class = "social-text mail">Mail</span></a></li>
        <li class="gplus" (click) = "socialShare('.googleplus')"><a href = "javascript:void(0)"> </a> <span class = "social-text">Google Plus</span></li>
        <li  class="in" (click) = "socialShare('.linkedin')"><a href="javascript:void(0)"></a> <span class = "social-text">LinkedIn</span></li>
        <li class="p" (click) = "socialShare('.pinterest')"><a href="javascript:void(0)"></a> <span class = "social-text">Pintrest</span></li>
        <li class="whatsup mobile" (click) = "socialShare('.whatsapp')"><a href="javascript:void(0)"><span class = "social-text whatsup-text">Whatsapp</span><i class="fa fa-whatsapp" aria-hidden="true"></i></a></li>
      </ul>
      
</div>
</div>`,
styleUrls:['./share.model.css']})
export class ShareModel{
    mailTo:string = 'abc@gmail.com';
    subject:string = 'News';
    mailCC:string = '';
    @Input('productDetail') productDetail:Object = {};
    socialShareLink:string;
    socialShareTitle:string;
    socialShareDescription:string;
    socialShareImage:string;
    socialCount:boolean = true;
    
    render:Renderer;
    element:ElementRef;
    //sharingUrl:string = "http://dev.demosparx.in/APC158/";
    baseUrl:string = "detail";
    isBrowser:boolean = false;


    constructor(@Inject(PLATFORM_ID) private platformId: Object,element:ElementRef,private changeDetectorRef:ChangeDetectorRef){
        
       this.element = element;
        if (isPlatformBrowser(this.platformId)) {
            this.socialShareLink = window.location.href;
      this.isBrowser = true;
      
       }
     
   }
   ngOnChanges(changes: { [productDetail: string]: SimpleChange }){
          if(this.productDetail['brand_data']){
            this.subject = this.socialShareTitle = this.socialShareDescription =  this.productDetail['brand_data']['translation_data'][0]['name']?this.productDetail['brand_data']['translation_data'][0]['name']:this.productDetail['brand_data']['name'];
          }
    }
  
   socialShare(selector){
      // alert("home=="+this.socialShareLink);
     let url;
     if(selector == '.facebook')
     url = 'http://www.facebook.com/sharer.php?u='+this.socialShareLink;
     else if(selector == '.twitter')
     url = 'https://twitter.com/share?url='+this.socialShareLink+'&text='+this.socialShareTitle;
     else if(selector == '.googleplus')
     url = 'https://plus.google.com/share?url='+this.socialShareLink;
     else if(selector == '.linkedin')
     url = 'http://www.linkedin.com/shareArticle?url='+this.socialShareLink+'&title='+this.socialShareTitle;
     else if(selector == '.pinterest')
     url = 'https://pinterest.com/pin/create/bookmarklet/?media=[post-img]&url='+this.socialShareLink+'&description='+this.socialShareTitle;
     else if(selector == '.whatsapp')
     url = 'whatsapp://send?text='+this.socialShareLink+"&title="+this.socialShareTitle+"&url="+this.socialShareLink;
    window.open(url);
    // $("."+this.templateType+" .sb-button"+selector+" button").click();
       //$(".sb-button"+selector+" button").click();
   }
   closeSharePopUp(){
       $(".overlay.model-share").css("display","none");
   }
   
   
    
}