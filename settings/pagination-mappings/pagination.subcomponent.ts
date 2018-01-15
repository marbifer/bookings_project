import { Component, Output, Input, ViewEncapsulation, ViewContainerRef, EventEmitter, ElementRef, Injectable, NgZone, OnInit , OnDestroy , OnChanges , SimpleChanges } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteParams} from '@angular/router-deprecated';
import myGlobals = require('../../../app');
import { LoadingGif } from '../../bworkspace/filedetail/loading_gif.service';
import { ModalFiltersServiceUsers } from '../../customers/modalfiltersUsers/modalfilters.service';
//import { DataPropertiesMapCategories } from '../mappings/all-mappings/data_properties.service';
//import { MappingsCategories } from '../mappings/all-mappings/mappings';
//import { ExternalProviders } from '../external-providers/external-providers';
import { DataPagination } from './data_pagination.service';
import { DataPropertiesListUsers } from '../../customers/list-users/data_properties.service';

declare var jQuery: any;
declare var $: any;

/////////////////////////
/// Plugin Pagination ///
/////////////////////////
@Component({
    selector: 'my-pagination',
    template: require('./pagination.html'),
    directives: [],
    styles: [require('./pagination.scss')],
    providers: [DataPagination , ModalFiltersServiceUsers]
})

export class myPagination {
     blocker_prev : boolean;
     blocker_next : boolean;

    @Output() change_current_page: EventEmitter<any> = new EventEmitter<any>();
    @Input() paginationTrigger : any;
    constructor( public _dataPropertiesUsers: DataPropertiesListUsers , public router: Router, public http: Http, public load: LoadingGif, public _data_pagination: DataPagination, private ngZone: NgZone) {
}

ngOnInit(){
    }
ngOnChanges(changes: SimpleChanges){
    if ( this.paginationTrigger == true) {
            // this._dataPropertiesUsers._data_pagination  // It must use this because the service resets itself in this component on destroy
            this.pagination_mappings({ fromModal : true , event:'search', _data_pagination: this._dataPropertiesUsers._data_pagination });
    }
}

    ////////////////////////////
    /// MY PLUGIN PAGINATION ///
    pagination_mappings(page_data) {
        console.log("page_Data:  " +JSON.stringify(page_data));
        if ( page_data._data_pagination.firstof_page + page_data._data_pagination.limit_per_pages > page_data._data_pagination.limit ) {
            page_data._data_pagination.last_page = page_data._data_pagination.limit; 
        } else {
            page_data._data_pagination.last_page = page_data._data_pagination.firstof_page + page_data._data_pagination.limit_per_pages - 1; 
        }
        // PREV POINTS
        if (page_data._data_pagination.firstof_page > 1 ) { //If more than 7 pages show prev button.  
            this.blocker_prev = false;
            jQuery('.pointsPrev').show();
        } else { //If at the begin remove Prev 
            setTimeout(()=>{
                if (page_data._data_pagination.current_page == 1 ) {
                    this.blocker_prev = true;
                } else {
                    this.blocker_prev = false;
                }        
                jQuery('.pointsPrev').hide();
            } , 500);      
        } 
        // NEXT POINTS

        if (page_data._data_pagination.numbers_of_pages > page_data._data_pagination.last_page) { //If more than 7 pages show next button.    
            this.blocker_next = false;
            jQuery('.pointsNext').show();
        } else { //If at the end remove Next  
            setTimeout(()=>{
                if ( page_data._data_pagination.current_page == page_data._data_pagination.numbers_of_pages ) {
                    this.blocker_next = true;                        
                } else {
                    this.blocker_next = false;
                }
                jQuery('.pointsNext').hide();
            } , 500);      
        }

        this._data_pagination = page_data._data_pagination;
        this._data_pagination.total_page = page_data._data_pagination.total_page;
        this._data_pagination.last_page = page_data._data_pagination.last_page; // store data from parameters
        this._data_pagination.firstof_page= page_data._data_pagination.firstof_page; // store data from parameters
        var events= page_data._data_pagination.event; // store data from parameters
        switch (page_data.event) {
            //////////////////////////////////////////////////////////////////
            case 'search':
                page_data._data_pagination.array_pages.length = 0; //Empty array
                if (page_data._data_pagination.limit > page_data._data_pagination.limit_per_pages) { //If more than 7 pages show next button.
                    for (var i = this._data_pagination.firstof_page; i <= this._data_pagination.last_page; i++) {
                        page_data._data_pagination.array_pages.push(i);
                    }
                } else if (page_data._data_pagination.limit <= page_data._data_pagination.limit_per_pages) {
                    //If less than 7 pages show next button.
                    for (var i = this._data_pagination.firstof_page; i <= this._data_pagination.last_page; i++) {
                        console.log(i);
                        page_data._data_pagination.array_pages.push(i);
                    }
                } //Close if
                break;
            //////////////////////////////////////////////////////////////////
            case 'select':
                if (page_data._data_pagination.current_page > page_data._data_pagination.limit_per_pages) { //If current page is higher than 7 show prev button.                  
                    // prev blocker false
                } else {
                    // prev blocker true
                }
                break;
            ////////////////////////////////////////////////////////////////
            case 'next':
                page_data._data_pagination.array_pages.length = 0; //Empty array 
                if (page_data._data_pagination.numbers_of_pages > page_data._data_pagination.last_page) { //If more than 7 pages show next button.    
                    for (var m = page_data._data_pagination.firstof_page; m <= page_data._data_pagination.last_page; m++) {
                        page_data._data_pagination.array_pages.push(m);
                    }
                //this.select(page_data._data_pagination.current_page);
                    
                } else { //If at the end remove Next  
                    for (var x = page_data._data_pagination.firstof_page; x <= page_data._data_pagination.numbers_of_pages; x++) {
                        page_data._data_pagination.array_pages.push(x);
                    }
                }
                
                break;
            ////////////////////////////////////////////////////////////////
            case 'prev':
                page_data._data_pagination.array_pages.length = 0; //Empty array 
                if (page_data._data_pagination.firstof_page > 1) { //If more than 7 pages show prev button.                
                    for (var p = page_data._data_pagination.firstof_page; p <= page_data._data_pagination.last_page; p++) {
                        page_data._data_pagination.array_pages.push(p);
                    }
                } else { //If at the begin remove Prev              
                    for (var c = page_data._data_pagination.firstof_page; c <= page_data._data_pagination.last_page; c++) {
                        page_data._data_pagination.array_pages.push(c);
                    }
                }
                break;
        } //Close switch 
    }

    ///////////////////////////////
    /// BUTTON EVENT PAGINATION ///
    select(number_of_page_selected) {
        number_of_page_selected = Number(number_of_page_selected);
        this.change_current_page.emit({type: 'select' , selectedPage : number_of_page_selected});
        //this.pagination_mappings({event : 'select' , selectedPage: number_of_page_selected });
    }

    next_page_map(e) {
        e.preventDefault();
        e.stopPropagation();
        if ( this._data_pagination.current_page != this._data_pagination.numbers_of_pages) {
            this._data_pagination.last_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages - 1; //8+7-1        
            if (this._data_pagination.current_page != this._data_pagination.last_page) {
                this.select(Number(this._data_pagination.current_page) + 1);
            } else {
                if (this._data_pagination.blocker_next == false) {
                    this._data_pagination.next_pages_u = this._data_pagination.limit_per_pages + 1; //Current page from 8
                    this._data_pagination.firstof_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages; //1 + 7
                    this._data_pagination.current_page = this._data_pagination.firstof_page; //Current page
                    this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
                    var letter = this._data_pagination.search_map_categories; //Store letter
                    this._data_pagination.last_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages - 1; //8+7-1        

                    this.select(this._data_pagination.current_page);
                    this.pagination_mappings({event: 'next'  , _data_pagination: this._data_pagination });
                    //Todo lo que está dentro del parámetro es un sólo objeto que se manda al eventEmiter, contiene la letra elegida, el nro de pág actual, el tipo de evento, cuál es la última página y cuál es la primera de las 7 que se muestran
                } 
            }
        }
    }

    pointsNext() {

        if ( this._data_pagination.current_page != this._data_pagination.numbers_of_pages) {
            this._data_pagination.next_pages_u = this._data_pagination.limit_per_pages + 1; //Current page from 8
            this._data_pagination.firstof_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages; //1 + 7
            this._data_pagination.current_page = this._data_pagination.firstof_page; //Current page
            this._data_pagination.numbers_of_pages = Math.ceil(this._data_pagination.total_page/10); //11÷10
            var letter = this._data_pagination.search_map_categories; //Store letter
            this._data_pagination.last_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages - 1; //8+7-1        

            this.select(this._data_pagination.current_page);
            this.pagination_mappings({event: 'next'  , _data_pagination: this._data_pagination });
        }
    }

    prev_page_map(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this._data_pagination.current_page != 1 ) {
            if (this._data_pagination.current_page  != this._data_pagination.firstof_page) {

                this.select(this._data_pagination.current_page - 1);

            } else {
                this._data_pagination.firstof_page = this._data_pagination.firstof_page - this._data_pagination.limit_per_pages; //8-7
                this._data_pagination.last_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages - 1; //8+7-1
                this._data_pagination.current_page = this._data_pagination.firstof_page; //Current page
                this.select(this._data_pagination.last_page);
                this.pagination_mappings({event: 'prev'  , _data_pagination: this._data_pagination });
            }
        }
    }

    pointsPrev(){
        this._data_pagination.firstof_page = this._data_pagination.firstof_page - this._data_pagination.limit_per_pages; //8-7
        this._data_pagination.last_page = this._data_pagination.firstof_page + this._data_pagination.limit_per_pages - 1; //8+7-1
        this._data_pagination.current_page = this._data_pagination.firstof_page; //Current page
        this.select(this._data_pagination.last_page);
        this.pagination_mappings({event: 'prev'  , _data_pagination: this._data_pagination });
    }

}//Close Class myPagination