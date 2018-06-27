import {Pipe,PipeTransform} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser';
@Pipe({name:'htmlSafe'})

export class HtmlSafe implements PipeTransform{
   
    sanitizer:DomSanitizer;
    constructor(sanitizer:DomSanitizer){
        this.sanitizer = sanitizer;
    }
    transform(html:string):any{
       return this.sanitizer.bypassSecurityTrustHtml(html);
    }

}