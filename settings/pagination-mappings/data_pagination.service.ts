import {Component, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Subscription } from "rxjs";

@Injectable()
export class DataPagination{

	//Pagination
	current_page: any;
	total_page: any;
	numbers_of_pages: any;
	array_pages=[];
	limit : any; 
	count_items : any; 
	last_page : any; 
	limit_per_pages:number = 7;
	firstof_page = 1; //First page of following page
	next_pages_u : any;
	blocker_next = false; //Stop propagation
	search_map_categories: any; //letter selected
    
	constructor(){} 
	
}