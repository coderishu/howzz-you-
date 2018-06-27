import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from './provider/app.changeLang'
import { HttpService } from './provider/http-service';
import {Loader} from './model/loader/loader.page.component';
import {appConstant} from './constant/app.constant';
import { ModelAlertPopup } from './model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'static-block-data',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content | htmlSafe">`,

    //  providers: [DataService]

})
export class StaticBlock implements OnChanges{
    //router:Router;
    //  dataService:DataService;
       //isRtl:boolean = false;
       staticBlocksData:any;
       baseUrl:string = appConstant.baseUrl;
       @Input('staticBlockName') staticBlockName:string;
    //    @Input('staticBlocksData') staticBlocksData:any;
       @Input('currentLanguageData') currentLanguageData:any;
       blockContent:any = {};
       
       
    constructor(private router:Router,private sanitizer: DomSanitizer,private languageTranslateService: LanguageTranslateInfoService,private httpService:HttpService){
        
       this.router=router;
       
         
        
       
}

ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
     // console.log(JSON.stringify(change));
     // if(this.staticBlocksData['currentValue'])
      // this.setBLockData();
        this.loadStaticBlock();
}
loadStaticBlock(){
    this.blockContent = {};
    //console.log("Object.keys(this.currentLanguageData).length=="+Object.keys(this.currentLanguageData).length)
    if(!this.staticBlockName)
    return
    else if(!this.currentLanguageData)
    return false;
      let url = this.baseUrl + "front/webservice/get_static_block_data";
      let data = {"identifiers":this.staticBlockName,
                    "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
      if(response['status'] == true && response['static_block_data'].length > 0){
          //console.log(JSON.stringify(response))
          this.staticBlocksData = response['static_block_data'];
          this.blockContent['id'] = this.staticBlocksData['id'];
          if(this.staticBlocksData[0]['block_data'].length > 0){
      this.blockContent['content'] = this.staticBlocksData[0]['block_data'][0]['content'];
      this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'][0]['block_title'];
          }
             
              else{
         this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'];
         this.blockContent['content'] = this.staticBlocksData[0]['content'];
              }
           this.blockContent['content'] =   this.blockContent['content'].replace(/routerlink/g,"routerLink");
             // console.log(JSON.stringify(this.blockContent))
              

          
      
        

      }
     
       
    });
   
}
   
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }

     ngAfterViewInit(){
   

  }
}