<?php
/**
* Plugin Name: 			nexxPLAY
* Plugin URI:  			https://omnia.nexx.cloud
* Description: 			Integration Plugin for nexxPLAY
* Version:     			3.5
* Requires at least: 	5.0
* Requires PHP:      	7.4
* Author:      			3Q nexx GmbH
* Author URI:  			https://3q.video
* License:     			GPL2
* License URI: 			https://www.gnu.org/licenses/gpl-2.0.html
*/

if (!defined('ABSPATH')) exit;

function nexxplay_event($action,$dom){
	if($dom>0){
		wp_remote_post("https://ping.nexx.cloud/".$dom."/domain/plugin/engage",[
			'method'=>'POST',
			'timeout'=>5,
			'blocking'=>TRUE,
			'body'=>[
				'action'=>$action,
				'type'=>'wordpress'
			]
		]);
	}
}

function nexxplay_deactivate(){
	$dom=get_option('nxp_domain',0);
	delete_option('nxp_domain');
	delete_option('nxp_key');
	delete_option('nxp_listview');
	delete_option('nxp_embedhost');
	nexxplay_event('uninstall',$dom);
}

function nexxplay_gettext($r){
	$arr=[
		'en'=>[
			'error'=>'Error',
			'warning'=>'Warning',
			'success'=>'Success',
			'configuration'=>'Configuration',
			'noresponse'=>"This Token seems to be invalid. Please try again later.",
			'firstsuccess'=>'You can now use all nexxPLAY Functionalities within your Editor.',
			'explainshort'=>'Insert the nexxOMNIA Instant Token below to configure the Plugin automatically.',
			'explainconfig'=>'In order to use the nexxPLAY Plugin, you need to authorize the Plugin to access the data in your nexxOMNIA Account.<br />If you dont know, what that means, please ask your Administrator or 3Q nexx directly via the Support Form.',
			'alreadyconfigured'=>'The nexxPLAY Plugin is already configured.',
			'explainsuccess'=>'The nexxPLAY Plugin has been configured successfully',
			'authorizeplugin'=>'authorize Plugin',
			'unauthorizeplugin'=>'remove Authorization'
		],
		'de'=>[
			'error'=>'Fehler',
			'warning'=>'Warnung',
			'success'=>'Perfekt',
			'configuration'=>'Konfiguration',
			'noresponse'=>"Der Token scheint ungültig zu sein. Bitte versuche es später noch einmal.",
			'firstsuccess'=>'Du kannst jetzt alle nexxPLAY Funktionalitäten im Editor verwenden.',
			'explainshort'=>'Bitte trage hier Dein nexxOMNIA Instant Token ein, um das Plugin automatisch zu konfigurieren.',
			'explainconfig'=>'Um das nexxPLAY Plugin zu verwenden, benötigst Du ein Instant Token aus Deinem nexxOMNIA Account.<br />Solltest Du nicht wissen, was das ist, frage Deinen Administrator oder 3Q nexx direkt über das Support Formular.',
			'alreadyconfigured'=>'Das nexxPLAY Plugin wurde bereits konfiguriert.',
			'explainsuccess'=>'Das nexxPLAY Plugin wurde erfolgreich konfiguriert.',
			'authorizeplugin'=>'Plugin autorisieren',
			'unauthorizeplugin'=>'Autorisierung löschen'
		]
	];
	return($arr[NEXXPLAY_LANGUAGE][$r]);
}

function nexxplay_menu(){
	$locale='en';
	if (current(explode("_",get_locale()))=="de"){
		$locale='de';
	}
	define('NEXXPLAY_LANGUAGE',$locale);
	add_options_page( 'nexxPLAY Config', 'nexxPLAY', 'manage_options', 'nexxplay-config', 'nexxplay_menu_render' );
}

function nexxplay_register_blocktype(){
	wp_oembed_add_provider('#https?://embed.nexx.cloud/.*#i', 'https://services.nexx.cloud/oembed/',TRUE);

	$dom=get_option('nxp_domain',0);
	if($dom>0){
		wp_enqueue_script('nexxplay','https://arc.nexx.cloud/sdk/'.$dom.'.play',['jquery']);

		$cl=get_option('nxp_embedhost');
		if(!empty($cl)){
			wp_oembed_add_provider('#https?://'.$cl.'/.*#i', 'https://services.nexx.cloud/oembed/',TRUE);
		}
	}
	wp_enqueue_script(
		'nexxplay_wp',
		plugins_url( 'nexxplay_wp.js', __FILE__ ),
		['wp-blocks', 'wp-editor', 'wp-element', 'wp-components']
	);
	wp_enqueue_script(
		'nexxwidget_wp',
		plugins_url( 'nexxwidget_wp.js', __FILE__ ),
		['wp-blocks', 'wp-editor', 'wp-element', 'wp-components']
	);

	$o=['domain'=>$dom,'key'=>get_option('nxp_key',""),'listview'=>get_option('nxp_listview'),'embedhost'=>get_option('nxp_embedhost')];

	wp_localize_script( 'nexxplay_wp', '_nxpconfig', $o );

	register_block_type( 'nexxplay/nexxplay', [
		'editor_script' => 'nexxplay_wp',
	]);
	register_block_type( 'nexxplay/nexxwidget', [
		'editor_script' => 'nexxwidget_wp',
	]);
}

function nexxplay_enqueue_js(){
	wp_enqueue_script(
		'nexxplay_js',
		plugins_url( 'nexxplay.js', __FILE__ ),
		['wp-blocks']
	);
}

function nexxplay_enqueue_css(){
	wp_enqueue_style( 'nexxplay_style', plugins_url( 'nexxplay.css', __FILE__ ) );
}

function nexxplay_menu_render() {
	if ( !current_user_can( 'manage_options' ) )  {
		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	}

	$currentToken="";
	$errorData="";
	$isAfterConfig=FALSE;
	if(!empty($_POST['removeConfig'])){
		nexxplay_deactivate();
	}
	if(!empty($_POST['instant-token'])){
		$currentToken=sanitize_text_field($_POST['instant-token']);
		$configData=wp_safe_remote_get("https://api.nexx.cloud/v3.1/0/domain/instantconfiguration/".$currentToken."?context=wordpress");
		if (is_wp_error($configData)) {
			$errorData=nexxplay_gettext('noresponse');
		}else{
			$json=json_decode($configData['body'],TRUE);
			if(($json)&&(array_key_exists('result',$json))){
				$isAfterConfig=TRUE;
				$details=$json['result']['general'];
				if(get_option('nxp_domain',NULL)!==NULL){
					update_option('nxp_domain',$details['ID']);
				}else{
					add_option('nxp_domain',$details['ID']);
				}
				if(get_option('nxp_key',NULL)!==NULL){
					update_option('nxp_key',$details['publickey']);
				}else{
					add_option('nxp_key',$details['publickey']);
				}
				if(get_option('nxp_listview',NULL)!==NULL){
					update_option('nxp_listview',$details['allowNetworkAccess']);
				}else{
					add_option('nxp_listview',$details['allowNetworkAccess']);
				}
				if(get_option('nxp_embedhost',NULL)!==NULL){
					update_option('nxp_embedhost',$details['customEmbedURL']);
				}else{
					add_option('nxp_embedhost',$details['customEmbedURL']);
				}
				nexxplay_event('install',$details['ID']);
			}else{
				$errorData=nexxplay_gettext('noresponse');
			}
		}
		if(!empty($errorData)){
			$errorData='<div class="error"><p><strong>'.nexxplay_gettext('error').'</strong>: '.$errorData.'.</p></div>';
		}
	}

	echo '<div class="wrap">';
	echo '<h2>nexxPLAY '.nexxplay_gettext('configuration').'</h2><br /><form action="" method="post">';
	echo $errorData;
	if(get_option('nxp_domain',NULL)!==NULL){
		if(!$isAfterConfig){
			echo '<div class="notice notice-warning"><p><strong>'.nexxplay_gettext('warning').'</strong>: '.nexxplay_gettext('alreadyconfigured').'</p></div>';
		}else{
			echo '<div class="notice notice-success"><p><strong>'.nexxplay_gettext('success').'</strong>: '.nexxplay_gettext('explainsuccess').'</p></div>';
		}
	}else{
		echo '<p>'.nexxplay_gettext('explainconfig').'</p>';
	}
	if(!$isAfterConfig){
		echo '<br /><p>'.nexxplay_gettext('explainshort').'</p>';
		echo '<table class="form-table"><tbody><tr class="form-field form-required"><th scope="row">Instant Token</th><td><input type="text" name="instant-token" value="'.$currentToken.'" aria-required="true" autocapitalize="none" autocorrect="off" maxlength="60"></td></tr></tbody></table>';
		echo '<p class="submit"><input type="submit" class="button-primary" value="'.nexxplay_gettext('authorizeplugin').'"></p>';
		if(get_option('nxp_domain',NULL)!==NULL){
			echo '<input type="hidden" name="removeConfig" id="removeConfig" value="0">';
			echo '<input type="button" class="button-secondary" onclick="jQuery(\'#removeConfig\').val(1);jQuery(\'form\').submit();" value="'.nexxplay_gettext('unauthorizeplugin').'">';
		}
		echo '</form>';
	}else{
		echo '<p>'.nexxplay_gettext('firstsuccess').'</p>';
	}
	echo '</div>';
}

add_action( 'init','nexxplay_register_blocktype');
add_action( 'enqueue_block_assets', 'nexxplay_enqueue_css' );

if(is_admin()){
	add_action('admin_menu','nexxplay_menu');
}

register_deactivation_hook( __FILE__, 'nexxplay_deactivate' );

?>