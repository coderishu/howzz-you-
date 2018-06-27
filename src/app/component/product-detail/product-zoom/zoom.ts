import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { ModelAlertPopup } from '../../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';
import { GlobalData } from '../../../provider/app.global';
//import '../../../../assets/js/xzoom.min.js';
declare var $:any;

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'image-zooming',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    templateUrl:"./zoom.html",

    //  providers: [DataService]

})
export class ImageZoom implements OnChanges{
    
	  //productZoomingBigImage:string = "assets/images/big_car.jpg";
	 // productZoomingSmallImage:string = "assets/images/small_car.jpg";
    
       @Input('productDetail') productDetail:any = {};
    //    @Input('staticBlocksData') staticBlocksData:any;
     //  @Input('currentLanguageData') currentLanguageData:any;
       
       
       
    constructor(private globalDataService:GlobalData,private router:Router,private sanitizer: DomSanitizer,private languageTranslateService: LanguageTranslateInfoService,private httpService:HttpService){
        
       this.router=router;
       
         
        
       
}
ngAfterViewInit() {
   //$(".xzoom,.xzoom-gallery").xzoom({zoomWidth: 400, title: true, tint: '#333', Xoffset: 15});
  //setTimeout(()=>{
      if(this.globalDataService.isBrowser)
 this.addLenceInImage();
 // },1000);
}
addClass(event){
    $(event.currentTarget).addClass("active");
    $(event.currentTarget).siblings().removeClass("active");

}
addLenceInImage(){
    
  $('#product_zoom .simpleLens-thumbnails-container img').simpleGallery({
            loading_image: 'demo/images/loading.gif'
        });

        $('#product_zoom .simpleLens-big-image').simpleLens({
            loading_image: 'demo/images/loading.gif'
        });

}

ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
   
      
}
ngOnDestroy(){
   
}
   
    ngOnInit() {
     
  }

 
}