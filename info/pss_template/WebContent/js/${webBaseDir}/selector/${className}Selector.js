<#include "/java_copyright.include">
<#include "/function.include">
/**
 * ${table.remarks}选择器
 */
 ${className}Selector = {
	/**
	 * @param {} isSingle 是否单选
	 * @param {} callbackOrConf 回调函数或配置选项，若为map类型，则表示为配置选项
	 * @param {} reset data
	 * @return {}
	 */
	getView : function(isSingle,data,callback) {
		var window = new Ext.Window({
			title : '请选择${table.remarks}',
			iconCls:'menu-appuser',
			width : 640,
			autoHeight : true,
			autuScroll:true,
			modal : true,
			closeAction: 'hide',
			items : [this.initPanel(isSingle,data)],
			buttons : [{
						text : '确认',
						iconCls:'btn-ok',
						handler : function(){
							var rows = Ext.getCmp('${className}SelectGrid').getSelectionModel().getSelections();
							callback && callback(rows);
							window.close();
						}
					}, {
						text : '关闭',
						iconCls:'btn-cancel',
						handler : function() {
							window.close();
						}
					}]
		});
		return window;
	},

	initPanel : function(isSingle,data) {
		var sm = null;
		if(isSingle){
			sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
		}else{
			sm = new Ext.grid.CheckboxSelectionModel();
		}
		var winGrid = new Ext.grid.EditorGridPanel({
			id : '${className}SelectGrid',
			autoHeight : true,//height:360,
			cm : new Ext.grid.ColumnModel({
				columns : [sm,
						new Ext.grid.RowNumberer()
						 <#list table.columns as c>,{
							header : '${getFieldName(c.columnAlias)}',
							width : 120,
							dataIndex : '${c.columnNameLower}'${doRendererStr('${c.columnAlias}',c)}
						}
						</#list>]
			}),
			sm : sm,
			store : new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
					url : __ctxPath + '/pss/list${className}.do'
				}),
				params : {
					start : 0,
					limit : 12
				},
				reader : new Ext.data.JsonReader({
					root : 'result',
					totalProperty : 'totalCounts',
					fields : [<#list table.columns as c><#if c_index!=0>,</#if>'${c.columnNameLower}'</#list>]
				}),
				remoteSort : true,
				autoLoad : true
			}),
			viewConfig : {
				forceFit : true,
				enableRowBody : false,
				showPreview : false
			}
		});
		
		//searchPanel
		var searchPanel = new Ext.FormPanel({
			autoHeight : true,
			frame : true,
			id : '${className}SearchForm',
			buttonAlign : 'center',
			buttons : [{
						xtype : 'button',
						text : '查詢',
						iconCls : 'search',
						handler : function() {
								searchPanel.getForm().submit({
									url:__ctxPath+'/pss/list${className}.do',
									method:'post',
									success : function(formPanel, action) {
										winGrid.getStore().proxy.conn.url=__ctxPath+'/pss/list${className}.do';
										var result = Ext.util.JSON.decode(action.response.responseText);
										if(data && data.length>0){
											sm.selectRecords(data);
										}
										winGrid.getStore().loadData(result);
									}
								});
						}
					}, {
						xtype : 'button',
						text : '清除',
						iconCls : 'reset',
						handler : function() {
							Ext.getCmp('${className}SearchForm').getForm().reset();
						}
					}],
			items : [{
				xtype : 'fieldset',
				title : '${table.remarks}查詢',
				layout : 'form',
				items : [{
					layout : 'column',
					columnWidth : 0.33,
					defaults : {
						layout : 'form',
						padding : '0 0 0 20px',
						labelAlign : 'right',
						labelWidth : 120,
						defaults : {
							xtype : 'textfield',
							width : 140
						}
					},
					items : [{
						items : [{
				      <#list table.columns as c>
								<#if c_index%3==1>
									<#if c.pk && c.javaType=='java.lang.String'>
									xtype:'hidden',
									</#if>
									fieldLabel : '${getFieldName(c.columnAlias)}',
									maxLength:18,
									${getComboStore('${c.columnAlias}',c,'Query')}
								},{
								</#if>
							</#list>
									xtype:'hidden'
								}]//
					},{
						items : [{
							<#list table.columns as c>
								<#if c_index%3==2>
									<#if c.pk && c.javaType=='java.lang.String'>
									xtype:'hidden',
									</#if>
									fieldLabel : '${getFieldName(c.columnAlias)}',
									maxLength:18,
									${getComboStore('${c.columnAlias}',c,'Query')}
								},{
								</#if>
							</#list>
								xtype:'hidden'
								}]//
					},{
						items : [{
							<#list table.columns as c>
								<#if c_index%3==0>
									<#if c.pk && c.javaType=='java.lang.String'>
									xtype:'hidden',
									</#if>
									fieldLabel : '${getFieldName(c.columnAlias)}',
									maxLength:18,
									${getComboStore('${c.columnAlias}',c,'Query')}
								},{
								</#if>
							</#list>
									xtype:'hidden'
								}]//
					}]
				}]
			}]
		});
		//end of searchPanel
		
		
		return new Ext.Panel({
			items : [searchPanel, winGrid]
		});
	}
	
};
