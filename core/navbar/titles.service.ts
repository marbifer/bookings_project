import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Subscription } from "rxjs";

declare var jQuery: any;
declare var $: any;

@Injectable()
export class TitleService {
  title_page: any;
  // EventEmitter should not be used this way - only for `@Output()`s
  // nameChange: EventEmitter<string> = new EventEmitter<string>();

  // Observable source for Title update
  titleChange: Subject<string> = new Subject<string>();
  constructor() {
    this.title_page = "Default Title"; 
  }

  change(title){
    this.title_page = title;
    this.titleChange.next(this.title_page); //Send update to suscriber
    console.log('Service Title: ' + this.title_page);
  }
}