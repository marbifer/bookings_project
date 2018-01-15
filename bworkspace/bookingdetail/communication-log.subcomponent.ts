import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, OnInit, NgZone , Input, Output, ViewChild, OnDestroy} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

//////////////////////////
/// Communication logs ///
@Component({
  selector: 'communication-log',
  template: require('./communication-log-subcomponent.html'),
  styles: [require('./communication-log-subcomponent.scss')],
  encapsulation: ViewEncapsulation.None,
  directives: [],
  providers: [] 
})

export class CommLogSubcomponent {   

    constructor(public http: Http) {} //Close constructor

ngOnInit(){}

} // Close class CommLogSubcomponent