  import { Injectable } from '@angular/core';
  import {appConstant} from '../constant/app.constant';

@Injectable()
export class PaymentInfoService {

displaySection:any={};

 constructor( ){
  this.displaySection = appConstant.ADDRESS;
  
    
  }

}