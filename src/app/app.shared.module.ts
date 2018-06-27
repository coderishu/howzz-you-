import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

import {HtmlSafe} from './pipe/html-safe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ HtmlSafe ],
  exports:      [ HtmlSafe ]
})
export class SharedModule { }