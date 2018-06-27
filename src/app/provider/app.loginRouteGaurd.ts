import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Router} from '@angular/router';
import { GlobalData } from './app.global';

@Injectable()
export class LoginRouteGaurd implements CanActivate {
// router:Router;
constructor(private globalData:GlobalData, private router:Router) {
  this.router = router;
}

canActivate() {
  if(this.globalData.isBrowser){
if(localStorage.getItem("userLoginDetail"))
    return true;
    else{
      this.router.navigate(['']);
      return false;
    }
  }
  else return true;
  
    
 
}
}