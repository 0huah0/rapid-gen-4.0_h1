<#include "/java_copyright.include">
<#include "/function.include">
Ext.ns('${className}View');
${className}View = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		${className}View.superclass.constructor.call(this, {
					id : '${className}View',
					title : '${table.remarks}',
					iconCls : 'menu-planmanage',
					region : 'center',
					items : [this.searchPanel, this.gridPanel]
		});
	},
	initUIComponents : function() {
		//searchPanel
		this.searchPanel = new Ext.FormPanel({
			autoHeight : true,
			frame : true,
			id : '${className}SearchForm',
			buttonAlign : 'center',
			buttons : [{
						xtype : 'button',
						text : '查詢',
						iconCls : 'search',
						handler : function() {
							var searchPanel = Ext.getCmp('${className}SearchForm');
							if (searchPanel.getForm().isValid()) {
								$search({
									searchPanel : searchPanel,
									gridPanel : Ext.getCmp('${className}Grid')
								});
							}
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
		
		
		//store
		this.store = new Ext.data.JsonStore({
					url : __ctxPath + '/pss/list${className}.do',
					root : 'result',
					totalProperty : 'totalCounts',
					fields : [<#list table.columns as c><#if c_index!=0>,</#if>'${c.columnNameLower}'</#list>
					]
		});
		
		//this.store.setDefaultSort('id', 'asc');
		this.store.load({
				params : {
						start : 0,
						limit : 25
				}
		});
		var cm = new Ext.grid.ColumnModel({
				columns : [new Ext.grid.RowNumberer(),{
			           <#list table.columns as c>
							header : '${getFieldName(c.columnAlias)}',
							dataIndex : '${c.columnNameLower}'${doRendererStr('${c.columnAlias}',c)}
						},{
						</#list>
						header : '管理',
						dataIndex : '${pkColumn.columnNameLower}',//
						renderer : function(v,m,r) {
							return isGranted('_${className}Edit') ?('&nbsp;<button title="修改" value=" " class="btn-edit" onclick="${className}View.edit(\''
							+ v + '\')"></button><button title="刪除" value=" " class="btn-del" onclick="${className}View.remove(\''
							+ v + '\')"></button>'):'';
						}
					}],
			defaults : {
				sortable : true,
				menuDisabled : false,
				width : 120
			}
		});

		this.gridPanel = new Ext.grid.GridPanel({
					id : '${className}Grid',
					height : 380,
					tbar : (isGranted('_${className}Edit') ? new Ext.Toolbar({
								id : '${className}FootBar',
								bodyStyle : 'text-align:left',
								items : [new Ext.Button({
											iconCls : 'btn-add',
											text : '新增${table.remarks}',
											handler : function() {
												new ${className}Form().show();
											}
										})]
							}) : null),
					store : this.store,
					//autoExpandColumn :'remark1',
					loadMask : true,
					cm : cm,
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '當前顯示從{0}至{1}，共{2}條記錄',
								emptyMsg : "無記錄"
							})
				});
		//end of store
	}
});// end of main view


//view static method
${className}View.remove = function(id) {
	var grid = Ext.getCmp("${className}Grid");
	Ext.Msg.confirm('刪除確認', '確定要刪除此筆數據？', function(btn) {
		if (btn == 'yes') {
			Ext.Ajax.request({
				url : __ctxPath
						+ '/pss/multiDel${className}.do',
				params : {
					ids : id
				},
				method : 'post',
				success : function(response, options) {
					var dbJson = eval("(" + response.responseText + ")");
					if(dbJson.success){
						Ext.ux.Toast.msg("信息", "成功刪除！");
						grid.getStore().reload({
							params : {
								start : 0,
								limit : 25
							}
						});
					}else{
						Ext.Msg.alert("信息", "該項沒能被刪除！");
					}
				}
			});
		}
	});
};

${className}View.edit = function(id) {
	new ${className}Form({
				recId : id
			}).show();
};

//end of view static method
