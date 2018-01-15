import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs";
import myGlobals = require('./../../../app');

declare var jQuery: any;
declare var $: any;

@Injectable()
export class pathName{

  reload_component: Subject<string> = new Subject<string>(); //Observable source

  constructor(public http:Http) {}

  //////////////////////////////////////////////////
  /// Method for All Mappings(Detect URL change) ///
  //////////////////////////////////////////////////
  detect_url_change(name_of_item_menu){
  	// myGlobals.mappingsControlGeneral += 1;
    this.reload_component.next(name_of_item_menu); //Send update to suscriber
  }
}


