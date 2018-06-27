import {Component, NgModule} from '@angular/core'

@Component({
  selector: 'my-test',
  template: `
    <h1>custom component</h1>
  `
})
export class TestComponent {}


@NgModule({
  declarations: [ TestComponent ],
  exports:    [ TestComponent ]
})
export class SharedModule {}