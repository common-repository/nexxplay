function _nxppw_updateEmbedWidget(h){
	_nxppw_updateClasses();
	var el=jQuery(".is-selected[data-type='nexxplay/nexxwidget']");
	var f=el.find(".nexxwidget-preview");
	if(f.length==1){
		el.find(".nexxwidget-preview").html("").hide();
	}
	var i=el.find("input[type='url']");
	var b=el.find("button.is-primary");
	i.val(h);
	_nxppw_handleParams(false,true);
	_nxppw_verifySamaritan('updateembed');
	i.trigger('change');
	b.click();
}

function _nxppw_updateEmbedWidgetByEnter(e){
	var keycode=(e.keyCode ? e.keyCode : e.which);
	if(keycode=='13'){
		document.activeElement.click();
	}
}

( function( blocks, blockEditor,element,components ) {

	const el = element.createElement;
	const { registerBlockType } = blocks;
	const { InspectorControls, BlockControls } = blockEditor;

	const {
		Button,
		Notice,
		PanelBody,
		SelectControl,
		Placeholder,
		Spinner} = components;


	registerBlockType( 'nexxplay/nexxwidget', {
		title: 'Widget',
		description: 'Promote your content with nexxPLAY Widgets.',
		icon: el('img',{src:'https://assets.nexx.cloud/media/53/32/93/09YS0I3MNL8NJV/32.png'}),
		category: 'embed',
		supports:{
			align:true
		},
		attributes:{
			link:{
				type:'string'
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

			function getAllWidgets(){
				var t="";
				var el=jQuery(".nexxwidget-results");
				el.hide();
				jQuery(".nexxwidget-error").hide();
				var params={addEmbedDetails:1};
				_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:'widgets',type:'wordpress',item:_nxpconfig.domain});
				if((_nxpconfig.listview)&&(parseInt(_nxpconfig.listview)==0)){
					params.restrictToCurrentDomain=1;
				}
				_play.system.connection.api.call("/domain/widgets",params,"GET").then(function(data){
					if(data){
						data.forEach(function(i){
							t+="<div tabindex='0' role='menuitem' class='nxpwp_row nxpwp_widget' onclick=\"_nxppw_updateEmbedWidget('"+i.embeddata.iframe+"');\" onkeydown=\"_nxppw_updateEmbedWidgetByEnter(event);\"><div class='nxpwp_row_content'>"+i.general.title+"<span>"+_play.tools.formatDate(i.general.created)+"</span></div></div>";
						});
						el.html(t).show();
					}else{
						jQuery(".nexxwidget-error").show();
					}
					jQuery(".nexxwidget-spinner").hide();
				}).catch(function(){
					jQuery(".nexxwidget-error").show();
					jQuery(".nexxwidget-spinner").hide();
				});
			}

			function renderWidgets(){
				jQuery(".nexxwidget-spinner").show();
				if(!_nxpconfig.session){
					_play.system.connection.api.call('/session/init',{addChannels:1,addFormats:1}).then(function(r){
						_play.config.setCid(r.general.cid);
						_nxpconfig.session=r.general.cid;
						_samaritan.init(r.system.samaritanToken);
						_nxppw_handleStructure(r.channels,r.formats);
						_samaritan.emitEvent(_samaritan.events.PLUGIN,_nxpconfig.domain,'domain',0,0,0,0,{action:'load',type:'wordpress',item:_nxpconfig.domain});
						getAllWidgets();
					}).catch(function(){
						jQuery(".nexxwidget-spinner").hide();
					});
				}else{
					getAllWidgets();
				}
			}

			function renderPreview(){
				var el=jQuery(".is-selected[data-type='nexxplay/nexxwidget']");
				var i=el.find("input[type='url']");
				if(_nxppw_verifyURL(i.val())){
					_nxppw_updateClasses();
					el.find(".nexxwidget-urlerror").hide();
					props.setAttributes({link:i.val()});
					el.find(".nexxwidget-preview").html("<iframe class='nexxapi-preview' src='"+i.val()+"' style='width:100%;height:100%;' frameborder='0' allow='autoplay; picture-in-picture; gyroscope; accelerometer; encrypted-media; web-share; clipboard-write; fullscreen'></iframe>").show();
				}else{
					el.find(".nexxwidget-urlerror").show();
				}
			}

			function togglePreview(){
				var el=jQuery(".is-selected[data-type='nexxplay/nexxwidget']");
				var i=el.find("input[type='url']");
				if(_nxppw_verifyURL(i.val())){
					var f=el.find(".nexxwidget-preview");
					if(f.length==1){
						el.find(".nexxwidget-preview").html("").hide();
					}else{
						renderPreview();
					}
				}else{
					el.find(".nexxwidget-urlerror").show();
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
					el( PanelBody, { title: _nxppw_getText('findwidgets'), initialOpen: true },

						(((_nxpconfig)&&(parseInt(_nxpconfig.domain)>0))?

							[
								el('div',{style:{marginBottom:"12px"}},
									el( Button,
										{
											isPrimary:true,
											style:{width:'100%'},
											onClick: (  ) => {
												renderWidgets()
											}
										},
										_nxppw_getText('showwidgets')
									),
								),

								el('div',{className:"nexxwidget-spinner",style:{display:"none"}},el(Spinner,{})),
								el(Placeholder,
									{
										className:"nexxwidget-results",
										role:"menu",
										style:{display:'none'}
									}),
								el( Notice,
									{
										isDismissible:false,
										className:"nexxwidget-error",
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
					el( PanelBody, { title: _nxppw_getText('widgetcontrol'), initialOpen: false },
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
									var r=_nxppw_handleLayout(value, true);
									props.setAttributes( { width: r.w, height: r.h } );
								},
								value: props.attributes.layout
							}
						)
					)
				),
				el('div',
					{
						className:'components-placeholder is-large nexxplay-component',
						style:{height:props.attributes.height+"px",justifyContent:'flex-start'}
					},
					el('div',
						{
							className:'nexxwidget-preview',
							style:{display:'none'}
						}
					),
					el('div',
						{
							className:'components-placeholder__label',
							style:{width:'100%',marginTop:'4rem'}
						},
						"nexxPLAY Widget"
					),
					el('div',
						{
							className:'components-placeholder__instructions',
							style:{width:'100%'}
						},
						_nxppw_getText('enterurlwidget')),
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
									placeholder: 'Widget URL',
									className:'components-placeholder__input',
									value: props.attributes.link,
									onChange: ( e ) => {
										var nl=e.target.value;
										props.setAttributes({link:nl});
										if((!nl)||(nl=="")){
											jQuery(e.target).parent().parent().find(".nexxwidget-urlerror").hide();
										}else if(!_nxppw_verifyURL(nl)){
											jQuery(e.target).parent().parent().find(".nexxwidget-urlerror").show();
											_nxppw_handleParams(true,true);
										}else{
											jQuery(e.target).parent().parent().find(".nexxwidget-urlerror").hide();
										}
									}
								}
							),
							el('button',
								{
									type: 'button',
									className:'components-button is-primary',
									onClick:function(){
										_nxppw_handleParams(true,true);
										_nxppw_verifySamaritan('updateembed');
										renderPreview();
									}
								},_nxppw_getText('embed'))),
						el( Notice,
							{
								isDismissible:false,
								status:'error',
								className:'nexxwidget-urlerror'
							},
							_nxppw_getText('invalidurlwidget')
						)
					)
				)
			]
		},
		save: function(props) {
			return (_nxppw_verifyURL(props.attributes.link)?el(
				'div',
				{
					className:'nexxwidget-container'
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
			):el('div',{className:'nexxwidget-container'},_nxppw_getText('invalidurlwidget')));
		},
	} );
}(
	window.wp.blocks,
	window.wp.blockEditor,
	window.wp.element,
	window.wp.components
) );