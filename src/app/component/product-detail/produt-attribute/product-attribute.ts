import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef,EventEmitter} from '@angular/core';
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

    selector:'product-attribute',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    templateUrl:"./product-attribute.html",

    //  providers: [DataService]

})
export class ProductAttribute implements OnChanges{
       @Input('productDetail') productDetail:any;
       @Input('queryFilterParams') queryFilterParams:any;
       
       @Output('changeAttributeVal') changeAttributeVal = new EventEmitter();
       @Input('variantAttribute') variantAttribute:any = {};  
       selectedVal:any;
       isLoadingFirst:boolean = false;
       selectedIndex:number = 0;
       selectedAttr:any=[];
       currentcode:any;
    
       
    constructor(private globalDataService:GlobalData,private router:Router,private sanitizer: DomSanitizer,private languageTranslateService: LanguageTranslateInfoService,private httpService:HttpService){
        
       this.router=router;
      // alert(22);
      
    
       
}

/*attribute_data(data) {
  alert(1);
   return data.code === 'Blue';}*/

//Function for manage variant attributes**********************************
changeVariant(event,selectedDefaultAttribute,optionItem1,index,attributeSelection){
  
  let optionItem={};
 
  if(event.target)
    this.currentcode = event.target.value;
    else
    this.currentcode = event;
      
 for(let a = 0;a<this.productDetail['brand_data']['default_attr'][index]['value'].length;a++){
    if(this.productDetail['brand_data']['default_attr'][index]['value'][a].code==this.currentcode){
     optionItem = this.productDetail['brand_data']['default_attr'][index]['value'][a];
    }
   }
   this.selectedIndex = index;
    
    //  if(optionItem['isAvail'] == undefined || optionItem['isAvail'] == true){
           this.productDetail['brand_data']['default_attr'][index]['attribute_val'] = optionItem['code'];
          
           if(this.productDetail['brand_data']['default_attr'].length > 1)
           this.filterVariant(index,selectedDefaultAttribute['attribute_code'],optionItem['code']);
        // }
         let variantAttribute = {}
         
            this.productDetail['brand_data']['default_attr'].map((item)=>{
               variantAttribute[item['attribute_code']] = item['attribute_val'];
             });
            
             let variantItem;
             let matchStatus = false;
            for(let i = 0;i<this.productDetail['brand_data']['varient_data'].length;i++){
              matchStatus = true;
               variantItem = this.productDetail['brand_data']['varient_data'][i];
               let attributeKey = Object.keys(variantAttribute);
              
               for(let j =0;j<attributeKey.length;j++){
                   if(variantAttribute[attributeKey[j]] != variantItem[attributeKey[j]]){
                    matchStatus = false;
                    }
                  }
               if(matchStatus == true){
                 variantAttribute["id"] = variantItem['product_id'];
                 variantAttribute["sku"] = variantItem['sku']; 
                 variantAttribute["osku"] = this.productDetail['brand_data']['main_sku']?this.productDetail['brand_data']['main_sku']:this.productDetail['brand_data']['sku'];
                 //console.log(variantAttribute["osku"])
                // variantAttribute['main_product_id'] = this.productDetail['main_product_id'];
                 break;
               }
             
            }
            
            if(matchStatus == false && attributeSelection){
       
         for(let i = 0;i<this.productDetail['brand_data']['default_attr'].length;i++){
           if(i == this.selectedIndex)
                 continue;
              for(let j = 0;j<this.productDetail['brand_data']['default_attr'][i]['value'].length;j++){
                    let attributeOption = this.productDetail['brand_data']['default_attr'][i]['value'][j];
                    if(attributeOption['isAvail']){
                        this.productDetail['brand_data']['default_attr'][i]['attribute_val'] = attributeOption['code'];
                        break;
                    }
                    

              }
         }
          this.changeVariant(event,selectedDefaultAttribute,optionItem,index,false);
              
             
            }
            // console.log("atr=="+JSON.stringify(this.productDetail['brand_data']['default_attr']))
              // console.log("matchStatus="+matchStatus);
              // console.log("isLoadingFirst="+this.isLoadingFirst);
         if(matchStatus == true && this.isLoadingFirst){
       variantAttribute['ind'] = this.selectedIndex;
       variantAttribute['isAvail'] = matchStatus;
      
        this.changeAttributeVal.emit({"productDetail":this.productDetail,"variantItem":variantAttribute});
     }
    this.isLoadingFirst = true;
      //alert("change Filter");
      //console.log(JSON.stringify(this.productDetail['brand_data']['default_attr']));
    }
//Function for filter variant ************************************************

filterVariant(index,selectedItemCode,selectedItemOptionCode){
  
   for(let i = 0;i<this.productDetail['brand_data']['default_attr'].length;i++){
     if(i == index)
     continue;
    
   let ItemCode = this.productDetail['brand_data']['default_attr'][i]['attribute_code'];
   let matchStatus = false;
   
   this.productDetail['brand_data']['default_attr'][i]['value'].map((defaultItem)=>{
     matchStatus = false;
     /********* find from all options varient_data ****/
       this.productDetail['brand_data']['varient_data'].map((item)=>{
       
        /* selected item 5 = 5 &&  match code value like white =white ********/                
          
          if((defaultItem['code'] == item[ItemCode]) && (item[selectedItemCode] == selectedItemOptionCode)){
             matchStatus = true;
             
          }
         
      });
       defaultItem["isAvail"] = matchStatus;
       
     });
   }
 
}
ngAfterViewInit() {
					//	.xzoom-gallery
		
	}
	
  ngOnChanges(change:{[productDetail:string]:SimpleChange} ){
  // alert(this.productDetail['brand_data']['default_attr'].length);
   //console.log(JSON.stringify(this.productDetail.brand_data.default_attr));
    if(this.productDetail['brand_data']['default_attr'].length > 0){
      this.selectedIndex = 0;
      this.isLoadingFirst = false;
      let seleDefaultAtt;
      let defaultAttrFound = false;
      this.selectedIndex = this.queryFilterParams['ind']?this.queryFilterParams['ind']:this.selectedIndex;
      for(let i = this.selectedIndex;i<this.productDetail['brand_data']['default_attr'].length;i++){
        
        if(this.selectedIndex != i)
        continue;
        seleDefaultAtt = this.productDetail['brand_data']['default_attr'][i];
       if(seleDefaultAtt['attribute_val'] != ''){
          for(let j = 0;j<seleDefaultAtt['value'].length;j++){
            let optionItem = seleDefaultAtt['value'][j];
           if(seleDefaultAtt['attribute_val'] == optionItem['code'])
              {
                defaultAttrFound = true;
                this.changeVariant(optionItem['code'],seleDefaultAtt,optionItem,this.selectedIndex,false);
                break;
              }
            }
           // break;
        }
       
        if(defaultAttrFound)
        break;
      
         
      }
         
    }
    
  }

   
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }

  
 
}