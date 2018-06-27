  import { Injectable } from '@angular/core';
  import { GlobalData } from './app.global';
 //import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserInfoService {
//userfavcount:any;
userInfo:any={};
userWishlistCount:any;
 constructor(private globalData:GlobalData, ){
 if(this.globalData.isBrowser){
  if(localStorage.getItem('userLoginDetail')!=null){
     this.userInfo = JSON.parse(localStorage.getItem('userLoginDetail'));
      this.userWishlistCount = this.userInfo.wishlist_count;
    }
 }
  
    
  }

}