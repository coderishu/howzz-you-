import {Component,PipeTransform,Pipe} from '@angular/core';

@Pipe({name:"stringsort"})

export class StringSort implements PipeTransform{
    transform(value:string):any
    {
      if (value.length > 35)
      return value.substr(0, 35) + ' ...';
    else
      return value;
    
    }

    }