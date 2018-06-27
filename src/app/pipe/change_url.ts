import {Pipe,PipeTransform} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser';
@Pipe({name:'urlSanatize'})

export class ChaneURL implements PipeTransform{
   
    sanitizer:DomSanitizer;
    constructor(sanitizer:DomSanitizer){
        this.sanitizer = sanitizer;
    }
    transform(url:string):any{
       return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}