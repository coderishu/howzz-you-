  import { Injectable } from '@angular/core';
  import { GlobalData } from './app.global';
 //import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CartDetailService {
cartdatacount:any = 0;
URLtogo:any ='';
userExist:boolean;
//isFirst:boolean=true;
//isFirst:BehaviorSubject<any>;
 constructor(private globalData:GlobalData){
  // this.isFirst = new BehaviorSubject<any>(this.isFirst);
  if(this.globalData.isBrowser){
  if(localStorage.getItem('userLoginDetail')!=null){
    this.userExist = true;
    }
    else{
      this.userExist = false;
    }
  }
  }

 // change(transData:any) {
  //  this.isFirst.next(transData);
  //}   
}