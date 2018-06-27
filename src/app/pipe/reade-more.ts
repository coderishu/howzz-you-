import {Pipe,PipeTransform} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser';
declare var $:any;
@Pipe({name:'readMore'})

export class ReadeMore implements PipeTransform{
   
    sanitizer:DomSanitizer;
    constructor(sanitizer:DomSanitizer){
        this.sanitizer = sanitizer;
    }
    transform(html:string,status,contentLength):any{
     let htmlContent = $(html).text();
       return status?htmlContent.substr(0,contentLength):htmlContent;
    }

}