"use strict"
var extend = require('util')._extend;
/**
* create a tool to process fasta (including parse and stringify)
* @constructor
* @version 0.0.1
*/
module.id='fasta';
/**
* parse string with fasta format into seq Objects
* @param {String} fa_str - string with fasta format
* @param {Object} args - arguments for fasta content(type,line_width...)
* @returns {Array} Array with seq object{name:'name',seq:'ATCG'}
*/
module.exports.parse = function(fa_str,args){
	// setup default args
	args = extend({
		type:'dna'
	},args);
	if(fa_str[0]!='>'){
		//first fasta detect
		return {_error:'name',msg:'Please check that your sequence name begins with “>”'};
	}else{
		var ex_re,seq_o=[];
		if(args.type=='dna'){
			ex_re = new RegExp('[efijlopquxz]', 'i');
		}else{
			ex_re = new RegExp('[bjouz]', 'i');
		}
		var fasta_tmp = fa_str.substring(1).split('\n>');
		for(var i=0;i<fasta_tmp.length;i++){
			var seq_tmp = fasta_tmp[i].split('\n');
			var seq_name = seq_tmp[0].replace(/^\s+|\s+$/g, '');
			var seq = seq_tmp.slice(1).join('');
			if(!seq_name || seq_tmp.length < 2){
				return {_error:'unknown',msg:'check each sequence with name and sequence characters'};
			}
			else if(ex_re.test(seq)){
				return {_error:'seq',msg:'The wrong molecular type for this type of BLAST analysis has been entered'};
			}
			seq_o.push({name:seq_name,seq:seq});
		}
		return seq_o;
	}
}
/**
* stringify seq object array into fasta string
* @param {Array} a_seq - array with seq objects
* @returns {String} String with fasta format
*/
module.exports.stringify = function(a_seq){
	var i,t_res,res='';
	a_seq.map(function(v){
		if('name' in v && 'seq' in v){
			t_res='>'+v.name+'\n';
			for(i = 0; i < v.seq.length; i+=70){
				t_res += v.seq.slice(i,i+70)+'\n';
			}
		}else{
			return {_error:'keys',msg:'check sequences object with name and seq keys'};
		}
		res += t_res;
	});
	return res;
}
