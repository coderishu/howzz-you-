import{Component,ViewChild,Input,Output,OnChanges,SimpleChange, ViewContainerRef,TemplateRef,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import { LanguageTranslateInfoService } from '../../../provider/app.changeLang'
import { HttpService } from '../../../provider/http-service';
import {Loader} from '../../../model/loader/loader.page.component';
import {appConstant} from '../../../constant/app.constant';
import { ModelAlertPopup } from '../../../model/alert/model.alert';
import {DomSanitizer  } from '@angular/platform-browser';
import { GlobalData } from '../../../provider/app.global';
import { FlashMessagesService } from 'ngx-flash-messages';
//import '../../../../assets/js/xzoom.min.js';
declare var $:any;

//  import {DataService} from '../../services/http-service';
declare var $:any;

@Component({

    selector:'customer-review',
    // template:`<div *ngIf = "blockContent" [innerHTML] = "blockContent.content"> </div>`,
    templateUrl:"./review.html",

    //  providers: [DataService]

})
export class CustomerReview implements OnChanges{
    
       sortReview:string = "recent";
       @Input('productId') productId:string;
       @Input('storeSettings') storeSettings:any;
       @Input('currentLanguageData') currentLanguageData:any;
       @Input('httpService') httpService:HttpService;
       @Input('userLoginDetail') userLoginDetail:any = null;
       @Input('baseUrl') baseUrl:any;
       @Input('globalDataService') globalDataService:GlobalData;
       @Output('getRatingReview') getRatingReview = new EventEmitter<any>();
       productReview:Array<any> = [];
       productReviewData:any = {};
       productRatingReview:any = {};
       viewMoreLoadCount:number = 10;
       viewMoreCount:number = 0;
       noRecord:boolean=false;
       totalRatingCount:any;
       isReviewEnable:any;
       
       
       
    constructor(private flashMessagesService:FlashMessagesService,private router:Router,private sanitizer: DomSanitizer){
        
       this.router=router;
       
         
        
       
}
changeSortingOrder(event){
  //console.log(event.currentTarget.value)
  this.sortReview = event.currentTarget.value;
  //console.log("this.sortReview=="+this.sortReview);
}
ngAfterViewInit() {
		
	}
	

ngOnChanges(change:{[currentLanguageData:string]:SimpleChange,userLoginDetail:SimpleChange,storeSettings:SimpleChange} ){
      
      if(this.currentLanguageData && this.productId && this.storeSettings)
      {
        this.isReviewEnable = this.storeSettings['STORE']['REVIEW']['enable'];
        this.loadReviewDetail();
      }
     
    //  if(this.userLoginDetail)
      
      
}

   
    ngOnInit() {
        
    
    //this.metaService.setTitle("Home Page");
    //this.metaService.setTag('og:image',"http://localost");
  }
  loadReviewDetail(){
     let url = this.baseUrl + "front/webservice/get_rating_list";
      //this.productId = "5a5f41e35ea0036a3c5a211b";
      let data = {"id":this.productId,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
    this.httpService.createPostRequest(url,data).subscribe((response: any) => {
        
      if(response['status'] == true){
          this.productReviewData = response;
          if(this.productReviewData['rating_data'].length > 0){
         this.totalRatingCount = this.productReviewData['rating_data'].length;
         this.productReview = new Array();
         this.viewMore();
       //productReviewData:any = {}; 
         this.productRatingReview = this.createRatingReview();
        // console.log(this.totalRatingCount+"<<<<<<<<<<<<<<<<<<productRatingReview productRatingReview productRatingReview productRatingReview");
         //console.log(JSON.stringify(this.productRatingReview));
         this.getRatingReview.emit(this.productRatingReview);
         this.noRecord = false;
        }
        else{
          this.productReview = new Array();
          this.productRatingReview = {};
          this.getRatingReview.emit(this.productRatingReview);
          this.noRecord = true;
        }

      }
     
    });
  }
  toggleLikes(reviewId,like)
  {
    //alert(reviewId);
    //alert("you are not logged In !!!");
    //this.userDetail['id'];
      if(!this.userLoginDetail)
    {
       this.router.navigate(['/login']);
       return false;
    }
    
    
    
      
      let url = this.baseUrl + "front/review/like_dislike_review";
        //this.productId = "59f038d15305019704aa00de";
        let data = {"user_id":this.userLoginDetail['id'],"likedislike":like,"review_id":reviewId,"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code']}
     
      this.httpService.createPostRequest(url,data).subscribe((response: any) => {
         this.loadReviewDetail(); 
        if(response['status'] == true)
        {
            // this.globalDataService.showToaster({type:"success",body:response['msg']});
          //  alert(response.msg)
            // alert("success")
         }
       //  else
          // this.globalDataService.showToaster({type:"success",body:response['msg']});
       //alert(response.msg)
      // alert("failed")
         // alert(1)
      });
    }

  viewMore() {
    if (this.productReviewData['rating_data'].length > this.productReview.length) {
      if (this.productReviewData['rating_data'].length >= (this.viewMoreCount * this.viewMoreLoadCount + this.viewMoreLoadCount)) {
        this.productReview = this.productReviewData['rating_data'].slice(this.viewMoreCount * this.viewMoreLoadCount, this.viewMoreLoadCount);
        this.viewMoreCount += 1;
      }
      else
        this.productReview = this.productReviewData['rating_data'];
    }
 }
 createRatingReview(){
     let productReview:any = {"1":0,"2":0,"3":0,"4":0,"5":0};
     let rating:number = 0;
     let count:number = 0;
     let ratingTotal:number=0;
   //  globalDataService
     this.productReviewData['rating_data'].map((data)=>{
        rating = data['summary_rating']/this.globalDataService.ratioOfRating;
     
        if(rating >= .5 && rating < 1.6)
        productReview['1'] += productReview['1']+1;

        else if(rating >= 1.6 && rating < 2.6)
        productReview['2'] += productReview['2']+1;

        else if(rating >= 2.6 && rating < 3.6)
        productReview['3'] += productReview['3']+1;

       else if(rating >= 3.6 && rating < 4.6)
      productReview['4'] += productReview['4']+1;
        
       else if(rating >= 4.6 && rating < 5.6)
        productReview['5'] += productReview['5']+1;
        // console.log(JSON.stringify(data));
     });
     Object.keys(productReview).map((key)=>{
      count += productReview[key];
      ratingTotal += productReview[key]*parseInt(key);
     });
     //console.log("ratingTotal =="+ratingTotal);
     //console.log(JSON.stringify(productReview));
     let averageRating = ((ratingTotal*100)/(count*this.globalDataService['maxRating']))/20;
     //console.log("averageRating11 =="+averageRating);
     productReview['total_count'] = count;
     productReview['average_rate'] = averageRating.toFixed(1);

     return productReview;

 }
 
 //productRating:Arra[]
 //Function to rate product************************************
 rateProduct(productId){
  // alert("you are logged In!!");
//   this.flashMessagesService.show('You are not logged In!', {
//     classes: ['alert', 'alert-warning'],  
//     timeout: 1000, // Default is 3000
// });
  if(localStorage.getItem('userLoginDetail')==null)
   this.router.navigate(['/login']);
   else{
   let userDetail = JSON.parse(localStorage.getItem('userLoginDetail'));
    let URL =  this.baseUrl+'front/review/check_review_product';
     let data = {"lang_id":this.currentLanguageData['id'],"lang":this.currentLanguageData['lng_code'],product_id:productId,user_id:userDetail.id};
     this.httpService.createPostRequest(URL,data).subscribe(response=>{
        if(response.status){
         // alert("ok to review");
           this.router.navigate(['/account/ratings',productId]);
          }
          else{
           // alert(response.msg);
              this.flashMessagesService.show(response.msg, {
                  classes: ['alert', 'alert-danger'],  
                  timeout: 2000, // Default is 3000
              });
            }
      });
    }
  }
}