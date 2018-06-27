import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';


@Injectable()
export class RouteGaurd implements CanActivate {

  constructor() {}

  canActivate() {
    return true;
  }
}