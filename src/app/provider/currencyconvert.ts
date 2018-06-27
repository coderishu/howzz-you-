import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { _throw } from 'rxjs/observable/throw';
import { filter, map, catchError } from 'rxjs/operators';

@Injectable()
export class CurrencyConvertService {
  currencyData:any = {};
  currentCurrencyData:any={};
constructor(){

  }


      
}