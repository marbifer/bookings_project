import {Component} from '@angular/core';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'validator'
})

export class Validator {
    constructor(){}

    CheckInput(){
    //Check success 
    jQuery('#basic').parsley().on('field:success', function() {
        $('#icon_notice').remove();
        $('#basic').after('<div id="icon_notice"></div>');
    	$('#icon_notice').append('<div class="check_success"></div>');
    }); 
    jQuery('#password').parsley().on('field:success', function() {
        $('#icon_pass').remove();
        $('#password').after('<div id="icon_pass"></div>');
    	$('#icon_pass').append('<div class="check_success"></div>');
    });
    //Check error
    jQuery('#basic').parsley().on('field:error', function() {
        $('#icon_notice').remove();
        $('#basic').after('<div id="icon_notice"></div>');
        $('#icon_notice').append('<div class="check_error"></div>');
    }); 
    jQuery('#password').parsley().on('field:error', function() {
        $('#icon_pass').remove();
        $('#password').after('<div id="icon_pass"></div>');
        $('#icon_pass').append('<div class="check_error"></div>');
    });    
  }

}

