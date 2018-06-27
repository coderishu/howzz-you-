import{Component,OnInit,Input,SimpleChange,EventEmitter,Output} from '@angular/core';
import {Router} from '@angular/router';
//import {DataService} from '../../services/http-service';

declare var $:any;

@Component({
    selector:'custum-bar-rating',
    template:`<li *ngFor = "let item of ratingMax;let rateIndex = index" (click) = "addRating(rateIndex,$event)" (mouseout) = "removeHoverRating(rateIndex,$event)" (mouseover) = "addOverRating(rateIndex,$event)">
    <span> <img  [src] = "(item == 'fa-star')? 'assets/images/yellow-star.png':'assets/images/gray-star.png'"  >
    </span></li>`,
     //providers: [DataService]
})
export class ProductRate implements OnInit{
    //router:Router;
    //dataServices:DataService;
     @Input('ratingCount') ratingCount:number;
     @Input('max') max:number;
     @Input('isEdit') isEdit:boolean;
     @Input('id') id:string;
     @Output('rateProduct') rateProduct = new EventEmitter<any>();
     updateRating:number = 0;
     ratingMax:any =  [];
     rateNumber:number = -1;
     tempRating:number = -1;
    constructor(private router:Router){
        this.router=router;
         
    }
    addOverRating(index,event){
        if(this.isEdit){
            if(index > this.rateNumber)
             this.tempRating = index;
             
        }
    }
    removeHoverRating(index,$event){
        if(this.isEdit){
            this.tempRating = this.rateNumber;
        }
       
        
    }
    addRating(index,event){
        if(this.isEdit){
            if(this.rateNumber == 0 && index == 0)
            this.rateNumber = -1
            else
            this.rateNumber = index;
            this.tempRating = this.rateNumber;
            //if(this.rateNumber > )
            this.ratingCount = this.rateNumber;
            this.createRating();
            //alert(this.tempRating);
            this.rateProduct.emit({"id":this.id,rating:this.ratingCount+1})
        }
        //  if(this.isEdit){
        //      if(this.rateNumber == 0 && index == 0)
        //      this.rateNumber = -1
        //      else
        //      this.rateNumber = index;
        //      this.tempRating = this.rateNumber;
     
        //  }
         
    }
    ngOnChanges(change:{[currentLanguageData:string]:SimpleChange} ){
     // console.log(JSON.stringify(change));
     // if(this.staticBlocksData['currentValue'])
      // this.setBLockData();
     
      if(this.ratingCount != undefined)
        this.createRating();
}
createRating(){
 // console.log("ratingCount=="+this.ratingCount)
    let fractionVal:any = (this.ratingCount%parseInt(this.ratingCount.toString()))
    this.ratingMax = [];
    let item:string;
   // console.log("parseInt(this.ratingCount.toString())=="+parseInt(this.ratingCount.toString()))
if(this.max > 0){
  for(let i = 0;i<this.max;i++) {
      if(parseInt(this.ratingCount.toString()) > i)
      item = 'fa-star'
      else if(parseInt(this.ratingCount.toString()) == i && fractionVal > .4)
      item = 'half-star';
      else
      item = 'blank';

   this.ratingMax.push(item);
  
}

//console.log("ratingCount=="+this.ratingMax) 

}


}



ngOnInit(){
//      text: string = "view";
// $('.category.selected').text()
}
//  ngAfterViewInit(){
//     var value=$('.category.selected').text();
//     console.log(value)
//     console.log(this.redirectService.redirect_menucategory().current_page)
//     }



}