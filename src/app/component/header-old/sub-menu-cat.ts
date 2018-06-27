import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from '../../provider/app.changeLang'
import { HttpService } from '../../provider/http-service';

import {appConstant} from '../../constant/app.constant';

import {DomSanitizer  } from '@angular/platform-browser';

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector: '[innerMenu]',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    template: `<li *ngFor = "let menuItem of menuData.subCat">
            <a href="javascript:void(0)" (click) = "toNavigate(menuItem)" *ngIf = "menuItem.translation_data.length > 0">{{menuItem.translation_data[0].name}}</a> 
		    <a href="javascript:void(0)" (click) = "toNavigate(menuItem)" *ngIf = "menuItem.translation_data.length == 0">{{menuItem.name}}</a>
           
     <li>`,

    //  providers: [DataService]

})
export class subMenuCategoryList implements OnChanges{
    //router:Router;
    //  dataService:DataService;
       //isRtl:boolean = false;
       staticBlocksData:any;
       baseUrl:string = appConstant.baseUrl;
       @Input('menuData') menuData:any;
       @Output("navigateToCategory") navigateOnCategory = new EventEmitter();
    
       
       
    constructor(private router:Router,private sanitizer: DomSanitizer,private languageTranslateService: LanguageTranslateInfoService,private httpService:HttpService){
        
       this.router=router;
        
}

ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
     // console.log(JSON.stringify(change));
     // if(this.staticBlocksData['currentValue'])
      // this.setBLockData();
        
}

   toNavigate(data:any){
     this.navigateOnCategory.emit(data);
   }
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }

     ngAfterViewInit(){
   

  }
}