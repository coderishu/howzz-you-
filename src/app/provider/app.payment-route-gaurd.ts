import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
//import { LoginService } from './login-service';
import {Router} from '@angular/router';
import { GlobalData } from './app.global';

@Injectable()
export class PaymentRouteGuard implements CanActivate {
 // router:Router;
  constructor(private globalData:GlobalData,private router:Router) {
    this.router = router;
  }

  canActivate() {
    if(this.globalData.isBrowser){
      if(this.globalData.isBrowser && localStorage.getItem("paymentAcess"))
      return true;
      else{
        this.router.navigate(['']);
        return false;
      }
    }
    else return true;
     
  
  }
}