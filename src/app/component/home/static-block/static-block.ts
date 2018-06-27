import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { ModelAlertPopup } from '../../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'static-block',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    template:`<div [innerHTML] = "staticBlocksData.content | htmlSafe"> </div>`,

    //  providers: [DataService]

})
export class StaticCmsBlock implements OnChanges{
    //router:Router;
    //  dataService:DataService;
       //isRtl:boolean = false;
       staticBlocksData:any={};
       baseUrl:string = appConstant.baseUrl;
       //@Input('staticBlockName') staticBlockName:string;
    //    @Input('staticBlocksData') staticBlocksData:any;
       @Input('indexNumber') index :number;
       @Input('currentLanguageData') currentLanguageData:any;
       @Input('blockSettingData') blockSettingData:Object = {};
       @Output('addNewBlock') addNewBlock = new EventEmitter<any>();
      // @Output('toggleIsLoadMore') toggleIsLoadMore = new EventEmitter<any>();
       blockContent:any = {};
       
       
    constructor(private router:Router,private sanitizer: DomSanitizer,private languageTranslateService: LanguageTranslateInfoService,private httpService:HttpService){
        
       this.router=router;
       
         
        
       
}

ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
       //console.log('Static block');
     //  console.log(JSON.stringify(change));
     // if(this.staticBlocksData['currentValue'])
      // this.setBLockData();
        this.loadStaticBlock();
}
loadStaticBlock(){
  //alert(1);
 // console.log("static block+++"+JSON.stringify(this.blockSettingData));
  let url = this.baseUrl + "front/homepage/home_page_data";
  let data = {"related_data":this.blockSettingData['releted_data'],"block_name":this.blockSettingData['block_name'],
              "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
this.httpService.createPostRequest(url,data).subscribe((response: any) => {
  this.addNewBlock.emit({"status":true});
  if(response['status'] == true){
    
    this.staticBlocksData['content'] = response['data']['block_data']['content'] != ''?response['data']['block_data']['content']:response['data']['content'];    
    this.staticBlocksData['title'] = response['data']['block_data']['title'] != ''?response['data']['block_data']['title']:response['data']['title'];              
    }
 
   
});
    // this.blockContent = {};
    // //console.log("Object.keys(this.currentLanguageData).length=="+Object.keys(this.currentLanguageData).length)
    // if(!this.staticBlockName)
    // return
    // else if(!this.currentLanguageData)
    // return false;
    //   let url = this.baseUrl + "front/webservice/get_static_block_data";
    //   let data = {"identifiers":this.staticBlockName,
    //                 "lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    // this.httpService.createPostRequest(url,data).subscribe((response: any) => {
    //     //console.log("json data=="+JSON.stringify(response));
    //   if(response['status'] == true && response['static_block_data'].length > 0){
    //       //console.log(JSON.stringify(response))
    //       this.staticBlocksData = response['static_block_data'];
    //       this.blockContent['id'] = this.staticBlocksData['id'];
    //       if(this.staticBlocksData[0]['block_data'].length > 0){
    //          this.blockContent['content'] = this.staticBlocksData[0]['block_data'][0]['content'];
    //          this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'][0]['block_title'];
    //       }
             
    //     else{
    //      this.blockContent['block_title'] = this.staticBlocksData[0]['block_title'];
    //      this.blockContent['content'] = this.staticBlocksData[0]['content'];
    //           }
    //        this.blockContent['content'] =   this.blockContent['content'].replace(/routerlink/g,"routerLink");
    //          // console.log(JSON.stringify(this.blockContent))
              
    //     }
    //  });
   
}
   
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }

     ngAfterViewInit(){
   

  }
}