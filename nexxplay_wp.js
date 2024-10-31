if(typeof(md5)=="undefined"){md5=function(){for(var m=[],l=0;64>l;)m[l]=0|4294967296*Math.abs(Math.sin(++l));return function(c){var e,g,f,a,h=[];c=unescape(encodeURI(c));for(var b=c.length,k=[e=1732584193,g=-271733879,~e,~g],d=0;d<=b;)h[d>>2]|=(c.charCodeAt(d)||128)<<8*(d++%4);h[c=16*(b+8>>6)+14]=8*b;for(d=0;d<c;d+=16){b=k;for(a=0;64>a;)b=[f=b[3],(e=b[1]|0)+((f=b[0]+[e&(g=b[2])|~e&f,f&e|~f&g,e^g^f,g^(e|~f)][b=a>>4]+(m[a]+(h[[a,5*a+1,3*a+5,7*a][b]%16+d]|0)))<<(b=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*b+a++%4])|f>>>32-b),e,g];for(a=4;a;)k[--a]=k[a]+b[a]}for(c="";32>a;)c+=(k[a>>3]>>4*(1^a++&7)&15).toString(16);return c}}();}

var _nxppw_arcready=false;
var _nxppw_guessedDomain=0;
var _nxppw_language='';
var _nxppw_settings={};
var _nxppw_templates={
	de:{
		notconfigured:"Um diese Funktion zu nutzen, musst Du das nexxPLAY Plugin auf der Admin Seite autorisieren.",
		enterurl:"Gib hier eine gültige Embed URL ein oder suche nach Medien in der Sidebar.",
		enterurlwidget:"Gib hier eine gültige Widget URL ein oder lasse Dir alle verfügbaren Widgets in der Sidebar anzeigen.",
		findmedia:'Suche Medien',
		findwidgets:'verfügbare Widgets',
		streamtype:'Medientyp',
		startsearch:'Suche starten',
		searchterm:'Suchbegriff',
		embed:'Einbinden',
		noitemsfound:'Keine Elemente gefunden.',
		playercontrol:'Player Eigenschaften',
		widgetcontrol:'Widget Eigenschaften',
		toggle:'Vorschau / Code',
		invalidurl:"Das ist keine gültige nexxPLAY Embed URL.",
		invalidurlwidget:"Das ist keine gültige nexxPLAY Widget URL.",
		playlists:"Playlisten",
		audioalbums:"Audio Alben",
		scenes:'Szenen',
		static:'statisch',
		replay:'Replay Button anzeigen',
		loop:'Medium endlos wiederholen',
		load:'RevolverPlay nutzen, wenn möglich',
		autoplay:'sofort starten (eventuell ohne Ton)',
		noautoplay:'auf Klick warten',
		showlatest:'neueste Elemente',
		showwidgets:'verfügbare Widgets aufrufen',
		showsuggestions:'Empfehlungen',
		items:'Elemente',
		season:'Staffel',
		campaign:'Kampagne',
		nocampaign:'keine Kampagne',
		allchannels:'in allen Channels',
		allformats:'in allen Formaten'
	},
	en:{
		notconfigured:"You must configure the nexxPLAY Plugin on the Admin Page for this Functionality.",
		enterurl:"Enter a valid Embed URL here or search for Media Items in the Sidebar.",
		enterurlwidget:"Enter a valid Widget URL here or show all available Widgets in the Sidebar.",
		findmedia:'Find Media',
		findwidgets:'available Widgets',
		streamtype:'Streamtype',
		startsearch:'start search',
		searchterm:'Query',
		embed:'Embed',
		noitemsfound:'No items found.',
		playercontrol:'Player Settings',
		widgetcontrol:'Widget Settings',
		toggle:'toggle Preview',
		invalidurl:"This is not a valid nexxPLAY Embed URL.",
		invalidurlwidget:"This is not a valid nexxPLAY Widget URL.",
		playlists:"Playlists",
		audioalbums:"Audio Albums",
		scenes:'Scenes',
		static:'static',
		replay:'show Replay Button',
		loop:'loop Media permanently',
		load:'use RevolverPlay, if possible',
		autoplay:'start immediatley (possibly without Sound)',
		noautoplay:'wait for Click',
		showlatest:'latest items',
		showwidgets:'show available Widgets',
		showsuggestions:'suggest items',
		items:'Elements',
		season:'Season',
		campaign:'Campaign',
		nocampaign:'keine Kampagne',
		allchannels:'in all Channels',
		allformats:'in all Formats'
	}
};

function _nxppw_getText(a){
	if(_nxppw_language==''){
		var urlParams = new URLSearchParams(window.location.search);
		if(urlParams.has('lang')){
			_nxppw_language=urlParams.get('lang').split("-")[0];
		}else{
			var lang=document.getElementsByTagName('html')[0].getAttribute('lang');
			if((lang)&&(lang!='')){
				_nxppw_language=lang.split("-")[0];
			}else{
				_nxppw_language=navigator.language.split("-")[0];
			}
		}
		if(_nxppw_language!='de'){
			_nxppw_language='en';
		}
	}
	return(_nxppw_templates[_nxppw_language][a]);
}

function _nxppw_verifySamaritan(a){
	if(typeof(_samaritan)=='object'){
		_samaritan.emitEvent(_samaritan.events.PLUGIN,_play.session.domain.id,'domain',0,0,0,0,{action:a,type:'wordpress',item:_play.session.domain.id});
	}else if(_nxppw_guessedDomain==0){
		var el=jQuery(".is-selected[data-type='nexxplay/nexxplay']");
		if((el)&&(el.length>0)){
			var i=el.find("input[type='url']");
			if((i)&&(i.length>0)){
				var u=i.val().split('://')[1];
				if(u){
					u=u.split('/')[1];
					if(parseInt(u)>0){
						_nxppw_guessedDomain=parseInt(u);
						jQuery.getScript("https://arc.nexx.cloud/sdk/"+_nxppw_guessedDomain+".play", function() {
							_play.system.connection.api.call('/session/init',{addChannels:1,addFormats:1,addCampaigns:1}).then(function(r){
								_play.config.setCid(r.general.cid);
								_nxpconfig.session=r.general.cid;
								_samaritan.init(r.system.samaritanToken);
								_nxppw_handleStructure(r.channels,r.formats,r.campaigns);
								_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxppw_guessedDomain,'domain',0,0,0,0,{action:'postload',type:'wordpress',item:_nxppw_guessedDomain});
							}).catch(function(){
								jQuery(".nexxapi-spinner").hide();
							});
						});
					}
				}
			}
		}
	}
}

function _nxppw_updateEmbed(h,s){
	_nxppw_updateClasses();
	var el=jQuery(".is-selected[data-type='nexxplay/nexxplay']");
	var f=el.find(".nexxapi-preview");
	if(f.length==1){
		el.find(".nexxplay-preview").html("").hide();
	}
	var i=el.find("input[type='url']");
	var b=el.find("button.is-primary");
	i.val(_play.tools.getEmbedLink(_nxpconfig.domain,h,_play._factory.tools.getSingularStreamtype(s)));
	_nxppw_handleParams(false);
	_nxppw_verifySamaritan('updateembed');
	i.trigger('change');
	b.click();
}

function _nxppw_updateEmbedByEnter(e){
	var keycode=(e.keyCode ? e.keyCode : e.which);
    if(keycode=='13'){
      document.activeElement.click();
	}
}

function _nxppw_handleLayout(a,forWidget){
	var el=jQuery(".is-selected[data-type='nexxplay/nexxplay']");
	if(forWidget){
		el=jQuery(".is-selected[data-type='nexxplay/nexxwidget']");
	}
	el.removeClass("nxpwp_layout_16_9,nxpwp_layout_21_9,nxpwp_layout_1_1,nxpwp_layout_9_16");
	var r={w:640,h:360};
	if(a=='1_1'){
		r.h=640;
	}else if(a=='21_9'){
		r.h=274;
	}else if(a=='9_16'){
		r.h=640;
		r.w=360;
	}
	el.addClass('nxpwp_layout_'+a);
	return(r);
}

function _nxppw_handleParams(fromInput,forWidget){
	if(typeof(_play)=='object'){
		_play.tools.log("UPDATING URL PARAMS FROM "+(fromInput?"INPUT":"SIDEBAR"),"PLUGIN");
	}
	var el=jQuery(".is-selected[data-type='nexxplay/"+(forWidget?'nexxwidget':'nexxplay')+"']");
	var h=el.find("input[type='url']");
	var u=h.val();

	if((fromInput)&&(!forWidget)){
		var r=null;
		var x=null;
		try{
			r=new URL(u);
		}catch(e){
			r=null;
		}
		if((!r)||(r.search=="")){
			jQuery(".nexxapi-datamode select").val("default");
			jQuery(".nexxapi-autoplay select").val("default");
			jQuery(".nexxapi-exitmode select").val("default");
			jQuery(".nexxapi-campaign select").val("");
		}else{
			var s=r.searchParams;
			x=s.get('autoPlay');
			if(x){
				_nxppw_settings.autoplay=x;
				jQuery(".nexxapi-autoplay select").val(x);
			}
			x=s.get('dataMode');
			if(x){
				_nxppw_settings.datamode=x;
				jQuery(".nexxapi-datamode select").val(x);
			}
			x=s.get('exitMode');
			if(x){
				_nxppw_settings.exitmode=x;
				jQuery(".nexxapi-exitmode select").val(x);
			}
			x=s.get('campaignCode');
			if(x){
				_nxppw_settings.campaignCode=x;
				jQuery(".nexxapi-campaign select").val(x);
			}
		}
	}else if(!forWidget){
		u=u.split("?")[0];
		x=jQuery(".nexxapi-autoplay select").val();
		if(x==undefined){
			x=(_nxppw_settings.autoplay||'default');
		}
		if(x!='default'){
			_nxppw_settings.autoplay=x;
			u+=(u.includes('?')?'&':'?')+'autoPlay='+x;
		}
		x=jQuery(".nexxapi-datamode select").val();
		if(x==undefined){
			x=(_nxppw_settings.datamode||'default');
		}
		if(x!='default'){
			_nxppw_settings.datamode=x;
			u+=(u.includes('?')?'&':'?')+'dataMode='+x;
		}
		x=jQuery(".nexxapi-exitmode select").val();
		if(x==undefined){
			x=(_nxppw_settings.exitmode||'default');
		}
		if(x!='default'){
			_nxppw_settings.exitmode=x;
			u+=(u.includes('?')?'&':'?')+'exitMode='+x;
		}
		x=jQuery(".nexxapi-campaign select").val();
		if(x==undefined){
			x=(_nxppw_settings.campaignCode||'');
		}
		if(x!=''){
			_nxppw_settings.campaignCode=x;
			u+=(u.includes('?')?'&':'?')+'campaignCode='+x;
		}
		h.val(u);
	}
	return(u);
}

function _nxppw_updateClasses(){
	var el=jQuery(".block-editor-block-inspector__advanced");
	if((el)&&(el.length==1)){
		var ip=el.find("input[type='text']");
		if((ip)&&(ip.val()=="")){
			ip.val('wp-embed-aspect-16-9 wp-has-aspect-ratio');
		}
	}
}

function _nxppw_removepreviewvideo(el){
	el.replaceWith("<img alt='"+el.data('data-description')+"' src='"+el.attr('data-image')+"' data-preview='"+el.prop('src')+"' />");
}

function _nxppw_removeallpreviewvideo(){
	jQuery.each(function(){
		el.replaceWith("<img alt='"+jQuery(this).attr('data-description')+"' src='"+jQuery(this).attr('data-image')+"' data-preview='"+jQuery(this).prop('src')+"' />");
	});
}

function _nxppw_verifyURL(nl){
	var t=false;
	if((nl)&&(nl.indexOf('http')==0)){
		if((nl.includes('embed.nexx.cloud'))||(nl.includes('embed-dev-cbr.nexx.cloud'))){
			t=true;
		}else if((_nxpconfig.embedhost)&&(_nxpconfig.embedhost!='')&&(nl.includes(_nxpconfig.embedhost))){
			t=true;
		}
	}
	return(t);
}

function _nxppw_prepopulateCampaigns(){
	var toreturn=[
		{label:_nxppw_getText('nocampaign'),value:''}
	];
	try{
		var ca=localStorage.getItem('nxp_campaign_cache');
		if(ca){
			ca=JSON.parse(ca);
			if(ca && Array.isArray(ca)){
				ca.forEach(function(i){
					toreturn.push({value:i.general.code,label:i.general.title});
				});
			}
		}
	}catch(e){}
	return(toreturn);
}

function _nxppw_handleStructure(ch,fo,ca){
	var el;
	if((fo)&&(fo.length)&&(fo.length>0)){
		el=jQuery(".nexxapi-format select");
		if((el)&&(el.length==1)){
			fo.forEach(function(i){
				el.append("<option value='"+i.general.ID+"'>"+i.general.title+"</option>");
			});
			jQuery(".nexxapi-format").css({display:'block'});
		}
	}
	if((ca)&&(ca.length)&&(ca.length>0)){
		el=jQuery(".nexxapi-campaign select");
		if((el)&&(el.length==1)){
			el.html("<option value=''>"+_nxppw_getText('nocampaign')+"</option>");
			ca.forEach(function(i){
				el.append("<option value='"+i.general.code+"'>"+i.general.title+"</option>");
			});
			try{
				localStorage.setItem('nxp_campaign_cache',JSON.stringify(ca));
			}catch(e){}
		}
	}
	if((ch)&&(ch.length)&&(ch.length>0)){
		el=jQuery(".nexxapi-channel select");
		if((el)&&(el.length==1)){
			var hasSubs=false;
			ch.forEach(function(i){
				if(parseInt(i.general.parent)>0){
					hasSubs=true;
				}
			});
			ch.forEach(function(i){
				if(parseInt(i.general.parent)==0){
					if(!hasSubs){
						el.append("<option value='"+i.general.ID+"'>"+i.general.title+"</option>");
					}else{
						var s="";
						ch.forEach(function(j){
							if(parseInt(j.general.parent)==parseInt(i.general.ID)){
								s+="<option value='"+j.general.ID+"'>"+j.general.title+"</option>";
							}
						});
						if(s==""){
							el.append("<option value='"+i.general.ID+"'>"+i.general.title+"</option>");
						}else{
							el.append("<optgroup label='"+i.general.title+"'>"+s+"</optgroup>");
						}
					}
				}
			});
			jQuery(".nexxapi-channel").css({display:'block'});
		}
	}
}

function onPlayReady(){
	_nxppw_arcready=true;
	_play.config.enableAPIAccess(_nxpconfig.key);
	jQuery('body').on("mouseenter","img[data-preview]",function(){
		_nxppw_removeallpreviewvideo();
		var p=jQuery(this).attr('data-preview');
		if(p!=''){
			jQuery(this).replaceWith("<video src='"+p+"' class='nxpwp_video' onerror='_nxppw_removepreviewvideo(jQuery(this))' poster='"+jQuery(this).prop('src')+"' data-image='"+jQuery(this).prop('src')+"' data-description='"+jQuery(this).prop('alt')+"' loop autoplay muted style='height:"+(jQuery(this).height())+"px;' />");
		}
	});
	jQuery('body').on("mouseleave","video[data-image]",function(){
		jQuery(this).replaceWith("<img alt='"+jQuery(this).attr('data-description')+"' src='"+jQuery(this).attr('data-image')+"' data-preview='"+jQuery(this).prop('src')+"' />");
	});
	jQuery('body').on("mouseleave",".block-editor-editor-skeleton__sidebar",function(){
		_nxppw_removeallpreviewvideo();
	});
}

( function( blocks, blockEditor,element,components ) {

	if(!_nxppw_arcready){
		if((typeof(_play)=="object")&&(_play.control.sdkIsReady())){
			onPlayReady();
		}
	}

	const el = element.createElement;
	const { registerBlockType,registerBlockCollection } = blocks;
	const { InspectorControls, BlockControls } = blockEditor;

	const { TextControl,
		SelectControl,
		Button,
		Notice,
		PanelBody,
		Placeholder,
		Spinner} = components;

	registerBlockCollection( 'nexxplay', { title: 'nexxPLAY' } );
	registerBlockType( 'nexxplay/nexxplay', {
		title: 'nexxPLAY',
		description: 'Embed your content with nexxPLAY.',
		icon: el('img',{src:'https://assets.nexx.cloud/media/53/32/93/09YS0I3MNL8NJV/32.png'}),
		category: 'embed',
		supports:{
			align:true
		},
		attributes:{
			streamtype:{
				type:'string',
				default:'videos'
			},
			query:{
				type:'string'
			},
			link:{
				type:'string'
			},
			autoplay:{
				type:'string',
				default:'default'
			},
			datamode: {
				type: 'string',
				default: 'default'
			},
			exitmode: {
				type: 'string',
				default: 'default'
			},
			layout: {
				type: 'string',
				default: '16_9'
			},
			width:{
				type:'int',
				default:640
			},
			height:{
				type:'int',
				default:360
			}
		},
		edit: function(props) {

			function getMediaQueryItems(streamtype,query,onlyLatest,useRecommendations){
				var t="";
				var el=jQuery(".nexxapi-results");
				el.hide();
				jQuery(".nexxapi-error").hide();
				if((!onlyLatest)&&((!query)||(query=='')||(query==undefined))){
					onlyLatest=true;
				}
				var method="GET";
				var ep=(onlyLatest?"latest":"byquery/"+encodeURIComponent(query));
				_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:(onlyLatest?'latest':'query'),type:'wordpress',item:_nxpconfig.domain});
				var params={limit:25,additionalfields:'channel'};
				if(jQuery('.nexxapi-channel').length==1){
					params.channel=jQuery('.nexxapi-channel select option:selected').val();
				}
				if(jQuery('.nexxapi-format').length==1){
					params.format=jQuery('.nexxapi-format select option:selected').val();
				}
				if(streamtype=='live'){
					params.includePremieres=1;
					params.includeAutoRecordings=1;
				}else if(streamtype=='videos'){
					params.includePremieres=1;
				}else if(streamtype=='collections'){
					params.includeStories=1;
				}else if(streamtype=='playlists'){
					params.includeSeasons=1;
				}
				if(params.includePremieres){
					params.addRestrictionDetails=1;
					params.addStreamDetails=1;
				}
				if((_nxpconfig.listview)&&(parseInt(_nxpconfig.listview)==0)){
					params.restrictToCurrentDomain=1;
				}
				if(useRecommendations){
					method="POST";
					ep="recommendationsforcontext";
					jQuery('#nexxapi_temp').remove();
					jQuery("body").append("<div id='nexxapi_temp' style='display:none;'></div>");
					jQuery('#nexxapi_temp').html(wp.data.select("core/editor").getEditedPostContent());
					params.content=jQuery('#nexxapi_temp').text();
					params.title=wp.data.select("core/editor").getEditedPostAttribute('title');
				}
				_play.system.connection.api.call("/"+streamtype+"/"+ep,params,method).then(function(data){
					if(data){
						data.forEach(function(i){
							var ht='';
							var aw='';
							var rt=i.general.runtime;
							var ct=i.general.uploaded;
							if(!rt){
								if((streamtype=='live')||(streamtype=='radio')){
									rt='';
								}else if(streamtype=='racks'){
									if(i.general.type=='scene'){
										rt=_nxppw_getText('scenes');
									}else{
										rt=(i.general.type=='video'?'Videos':'LiveStreams');
									}
								}else{
									rt=i.general.itemcount+" "+_nxppw_getText('items');
								}
							}
							if(!ct){
								ct=i.general.created;
							}
							if(i.general.type=='season'){
								ht=_nxppw_getText('season');
							}else if(i.general.type=='story'){
								ht='Story';
							}
							if(!_play.tools.imageIsEmpty(i.imagedata.artwork)){
								aw=i.imagedata.artwork;
							}
							if((i.streamdata)&&(i.streamdata.isPremiere==1)){
								rt='';
								ht='Premiere';
								ct=i.restrictiondata.validFrom;
							}
							t+="<div tabindex='0' role='menuitem' class='nxpwp_row' onclick=\"_nxppw_updateEmbed('"+i.general.hash+"','"+props.attributes.streamtype+"');\" onkeydown=\"_nxppw_updateEmbedByEnter(event);\"><div class='nxpwp_img'><img src='"+i.imagedata.thumb+"' alt='"+i.imagedata.description+"' data-preview='"+(i.imagedata.preview||"")+"' loading='lazy' />"+(aw?"<img src='"+aw+"' alt='' class='nxpwp_artwork' loading='lazy' />":"")+(ht?"<div class='nxpwp_row_hint'>"+ht+"</div>":"")+"</div><div class='nxpwp_row_content'><span style='opacity:.3;'>"+rt+"</span>"+i.general.title+"<span>"+_play.tools.formatDate(ct)+"</span></div></div>";
						});
						el.html(t).show();
					}else{
						jQuery(".nexxapi-error").show();
					}
					jQuery(".nexxapi-spinner").hide();
				}).catch(function(){
					jQuery(".nexxapi-error").show();
					jQuery(".nexxapi-spinner").hide();
				});
			}

			function renderMediaQuery(onlyLatest){
				jQuery(".nexxapi-spinner").show();
				var s=props.attributes.streamtype;
				var q=props.attributes.query;
				if(!_nxpconfig.session){
					_play.system.connection.api.call('/session/init',{addChannels:1,addFormats:1,addCampaigns:1}).then(function(r){
						_play.config.setCid(r.general.cid);
						_nxpconfig.session=r.general.cid;
						_samaritan.init(r.system.samaritanToken);
						_nxppw_handleStructure(r.channels,r.formats,r.campaigns);
						_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:'load',type:'wordpress',item:_nxpconfig.domain});
						getMediaQueryItems(s,q,onlyLatest);
					}).catch(function(){
						jQuery(".nexxapi-spinner").hide();
					});
				}else{
					getMediaQueryItems(s,q,onlyLatest);
				}
			}

			function renderMediaLatest(){
				jQuery(".nexxapi-spinner").show();
				var s=props.attributes.streamtype;
				var q=props.attributes.query;
				if(!_nxpconfig.session){
					_play.system.connection.api.call('/session/init',{addChannels:1,addFormats:1,addCampaigns:1}).then(function(r){
						_play.config.setCid(r.general.cid);
						_nxpconfig.session=r.general.cid;
						_samaritan.init(r.system.samaritanToken);
						_nxppw_handleStructure(r.channels,r.formats,r.campaigns);
						_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:'load',type:'wordpress',item:_nxpconfig.domain});
						getMediaQueryItems(s,q,true);
					}).catch(function(){
						jQuery(".nexxapi-spinner").hide();
					});
				}else{
					getMediaQueryItems(s,q,true);
				}
			}

			function renderMediaRecommendations(){
				jQuery(".nexxapi-spinner").show();
				var s=props.attributes.streamtype;
				if(!_nxpconfig.session){
					_play.system.connection.api.call('/session/init',{addChannels:1,addFormats:1,addCampaigns:1}).then(function(r){
						_play.config.setCid(r.general.cid);
						_nxpconfig.session=r.general.cid;
						_samaritan.init(r.system.samaritanToken);
						_nxppw_handleStructure(r.channels,r.formats,r.campaigns);
						_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:'load',type:'wordpress',item:_nxpconfig.domain});
						getMediaQueryItems(s,'',false,true);
					}).catch(function(){
						jQuery(".nexxapi-spinner").hide();
					});
				}else{
					getMediaQueryItems(s,'',false,true);
				}
			}

			function renderPreview(){
				var el=jQuery(".is-selected[data-type='nexxplay/nexxplay']");
				var i=el.find("input[type='url']");
				if(_nxppw_verifyURL(i.val())){
					_nxppw_updateClasses();
					el.find(".nexxapi-urlerror").hide();
					props.setAttributes({link:i.val()});
					var l=i.val();
					l+=(l.includes('?')?'&':'?')+'disableAds=1';
					el.find(".nexxplay-preview").html("<iframe class='nexxapi-preview' src='"+l+"' style='width:100%;height:100%;' frameborder='0' allow='autoplay; picture-in-picture; gyroscope; accelerometer; encrypted-media; web-share; clipboard-write; fullscreen'></iframe>").show();
				}else{
					el.find(".nexxapi-urlerror").show();
				}
			}

			function togglePreview(){
				var el=jQuery(".is-selected[data-type='nexxplay/nexxplay']");
				var i=el.find("input[type='url']");
				if(_nxppw_verifyURL(i.val())){
					var f=el.find(".nexxapi-preview");
					if(f.length==1){
						el.find(".nexxplay-preview").html("").hide();
					}else{
						renderPreview();
					}
				}else{
					el.find(".nexxapi-urlerror").show();
				}
			}

			return [
				el(
					BlockControls,
					{},
					el(
						Button,
						{
							icon:'update',
							className:'components-toolbar',
							label:_nxppw_getText('toggle'),
							onClick: (  ) => {
								togglePreview();
							}
						}
					)
				),
				el(InspectorControls,{},
					el( PanelBody, { title: _nxppw_getText('findmedia'), initialOpen: true },

						(((_nxpconfig)&&(parseInt(_nxpconfig.domain)>0))?

							[el( SelectControl,
								{
									label: _nxppw_getText('streamtype'),
									options : [
										{ label: 'Videos', value: 'videos' },
										{ label: 'LiveStreams', value: 'live' },
										{ label: 'Audio', value: 'audio' },
										{ label: 'Radio', value: 'radio' },
										{ label: _nxppw_getText('scenes'), value: 'scenes' },
										{ label: _nxppw_getText('playlists'), value: 'playlists' },
										{ label: _nxppw_getText('audioalbums'), value: 'audioalbums' },
										{ label: 'Racks', value: 'racks' },
										{ label: 'Collections', value: 'collections' },
										{ label: 'Sets', value: 'sets' }
									],
									onChange: ( value ) => {
										props.setAttributes( { streamtype: value } );
									},
									value: props.attributes.streamtype
								}
							),
								el( SelectControl,
									{
										label: 'Channel',
										className:"nexxapi-channel",
										options : [
											{label:_nxppw_getText('allchannels'),value:'0'}
										],
										onChange: ( value ) => {
										}
									}
								),
								el( SelectControl,
									{
										label: 'Format',
										className:"nexxapi-format",
										options : [
											{label:_nxppw_getText('allformats'),value:'0'}
										],
										onChange: ( value ) => {
										}
									}
								),
								el('div',{style:{marginBottom:"12px",position:'relative',top:'-12px'}},
									el( Button,
										{
											isPrimary:true,
											onClick: (  ) => {
												renderMediaLatest()
											}
										},
										_nxppw_getText('showlatest')
									),
									el( Button,
										{
											isSecondary:true,
											style:{float:'right'},
											onClick: (  ) => {
												renderMediaRecommendations()
											}
										},
										_nxppw_getText('showsuggestions')
									),
								),
								el( TextControl,
									{
										label: _nxppw_getText('searchterm'),
										onChange: ( value ) => {
											props.setAttributes( { query: value } );
										},
										value: props.attributes.query
									}
								),
								el('div',{style:{width:'100%',textAlign:'right',position:'relative',top:'-12px'}},el( Button,
									{
										isPrimary:true,
										onClick: (  ) => {
											renderMediaQuery()
										}
									},
									_nxppw_getText('startsearch')
								)),
								el('div',{className:"nexxapi-spinner",style:{display:"none"}},el(Spinner,{})),
								el(Placeholder,
									{
										className:"nexxapi-results",
										role:"menu",
										style:{display:'none'}
									}),
								el( Notice,
									{
										isDismissible:false,
										className:"nexxapi-error",
										style:{display:'none'},
										status:'error'
									},
									_nxppw_getText('noitemsfound')
								)
							]

							:el( Notice,
								{
									isDismissible:false,
									status:'error'
								},
								_nxppw_getText('notconfigured')
							))

					),

					el( PanelBody, { title: _nxppw_getText('playercontrol'), initialOpen: false },

						el( SelectControl,
							{
								label: 'DataMode',
								className:"nexxapi-datamode",
								options : [
									{ label: 'Standard', value: 'default' },
									{ label: 'API', value: 'api' },
									{ label: _nxppw_getText('static'), value: 'static' }
								],
								onChange: ( value ) => {
									props.setAttributes( { datamode: value } );
									var url=_nxppw_handleParams();
									props.setAttributes( { link: url } );
								},
								value: props.attributes.datamode
							}
						),

						el( SelectControl,
							{
								label: 'AutoPlay',
								className:"nexxapi-autoplay",
								options : [
									{ label: 'Standard', value: 'default' },
									{ label: _nxppw_getText('autoplay'), value: '1' },
									{ label: _nxppw_getText('noautoplay'), value: '0' }
								],
								onChange: ( value ) => {
									props.setAttributes( { autoplay: value } );
									var url=_nxppw_handleParams();
									props.setAttributes( { link: url } );
								},
								value: props.attributes.autoplay
							}
						),

						el( SelectControl,
							{
								label: 'ExitMode',
								className:"nexxapi-exitmode",
								options : [
									{ label: 'Standard', value: 'default' },
									{ label: _nxppw_getText('replay'), value: 'replay' },
									{ label: _nxppw_getText('loop'), value: 'loop' },
									{ label: _nxppw_getText('load'), value: 'load' }
								],
								onChange: ( value ) => {
									props.setAttributes( { exitmode: value } );
									var url=_nxppw_handleParams();
									props.setAttributes( { link: url } );
								},
								value: props.attributes.exitmode
							}
						),

						el( SelectControl,
							{
								label: _nxppw_getText('campaign'),
								className:"nexxapi-campaign",
								options : _nxppw_prepopulateCampaigns(),
								onChange: ( value ) => {
									props.setAttributes( { campaignCode: value } );
									var url=_nxppw_handleParams();
									props.setAttributes( { link: url } );
								},
								value: (props.attributes.campaignCode||"")
							}
						),

						el( SelectControl,
							{
								label: 'Layout',
								className:"nexxapi-layout",
								options : [
									{ label: '16:9', value: '16_9' },
									{ label: '21:9', value: '21_9' },
									{ label: '1:1', value: '1_1' },
									{ label: '9:16', value: '9_16' }
								],
								onChange: ( value ) => {
									props.setAttributes( { layout: value } );
									var r=_nxppw_handleLayout(value);
									props.setAttributes( { width: r.w, height: r.h } );
								},
								value: props.attributes.layout
							}
						)
					)

				),
				el('div',
					{
						className:'components-placeholder is-large nexxplay-component nxpwp_layout_'+props.attributes.layout,
						style:{height:props.attributes.height+"px",justifyContent:'flex-start'}
					},
					el('div',
						{
							className:'nexxplay-preview',
							style:{display:'none'}
						}
					),
					el('div',
						{
							className:'components-placeholder__label',
							style:{width:'100%',marginTop:'4rem'}
						},
						"nexxPLAY Embed"
					),
					el('div',
						{
							className:'components-placeholder__instructions',
							style:{width:'100%'}
						},
						_nxppw_getText('enterurl')),
					el('div',
						{
							className:'components-placeholder__fieldset',
						},
						el('form',
							{
								action:""
							},el('input',
								{
									type: 'url',
									placeholder: 'Embed URL',
									className:'components-placeholder__input',
									value: props.attributes.link,
									onChange: ( e ) => {
										var nl=e.target.value;
										props.setAttributes({link:nl});
										if((!nl)||(nl=="")){
											jQuery(e.target).parent().parent().find(".nexxapi-urlerror").hide();
										}else if(!_nxppw_verifyURL(nl)){
											jQuery(e.target).parent().parent().find(".nexxapi-urlerror").show();
											_nxppw_handleParams(true);
										}else{
											jQuery(e.target).parent().parent().find(".nexxapi-urlerror").hide();
										}
									}
								}
							),
							el('button',
								{
									type: 'button',
									className:'components-button is-primary',
									onClick:function(){
										_nxppw_handleParams(true);
										_nxppw_verifySamaritan('updateembed');
										renderPreview();
									}
								},_nxppw_getText('embed'))),
						el( Notice,
							{
								isDismissible:false,
								status:'error',
								className:'nexxapi-urlerror'
							},
							_nxppw_getText('invalidurl')
						)
					)
				)
			]
		},
		save: function(props) {
			return (_nxppw_verifyURL(props.attributes.link)?el(
				'div',
				{
					className:'nexxplay-container'
				},
				el('iframe',
					{
						width:props.attributes.width,
						height:props.attributes.height,
						frameborder:0,
						allow:'autoplay; picture-in-picture; gyroscope; accelerometer; encrypted-media; web-share; clipboard-write; fullscreen',
						src:props.attributes.link
					}
				)
			):el('div',{className:'nexxplay-container'},_nxppw_getText('invalidurl')));
		},
	} );
}(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.components
) );