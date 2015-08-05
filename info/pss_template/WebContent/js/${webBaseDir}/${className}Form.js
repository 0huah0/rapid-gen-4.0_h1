<#include "/java_copyright.include">
<#include "/function.include">
Ext.ns('${className}Form');
${className}Form = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		${className}Form.superclass.constructor.call(this, {
					items : this.formPanel,
					modal : true,
					id : '${className}FormWin',
					title : this.recId?'修改${table.remarks}':'新增${table.remarks}',
					iconCls : 'menu-planmanage',
					width : 960,
					buttons : this.buttons
				});
	},
	initUIComponents : function() {
		var recId = this.recId;
		var readOnly = this.read;
		
		this.formPanel = new Ext.FormPanel({
			id : '${className}Form',
			frame : true,
			items : [{
					layout : 'column',
					columnWidth : 0.5,
					defaults : {
						layout : 'form',
						padding : '0 0 0 20px',
						labelAlign : 'right',
						labelWidth : 160,
						defaults : {
							xtype : 'textfield',
							allowBlank : false,
							disabled : readOnly,
							maxLength:100,
							width : 200
						}
					},
					items : [{
						items : [{
									id:'hiddenId',
									xtype : 'hidden',
									value : recId||''
				      <#list table.columns as c>
								<#if c_index%2==0>
								},{
									fieldLabel : '${getFieldName(c.columnAlias)}',
									id:'${c.columnNameLower}',
									${getComboStore('${c.columnAlias}',c,'Form')}
								</#if>
							</#list>
					      }]
					},{
						items : [{
									xtype : 'hidden'
							<#list table.columns as c>
								<#if c_index%2!=0>
								},{
									fieldLabel : '${getFieldName(c.columnAlias)}',
									id:'${c.columnNameLower}',
									${getComboStore('${c.columnAlias}',c,'Form')}
								</#if>
							</#list>
				        }]
					}]
				}]
		});

		if (recId) {
				Ext.Ajax.request({
					url : __ctxPath + '/pss/get${className}.do?id='+ recId,
						success : function(response , options ) {
							var jr = Ext.util.JSON.decode(response.responseText); 
							jr.data.createDate = new Date(jr.data.createDate).format('Y-m-d H:i');
							if(jr.data.updateDate)jr.data.updateDate = new Date(jr.data.updateDate).format('Y-m-d H:i');
							Ext.getCmp("${className}Form").getForm().loadRecord(jr);
					},
					failure : function(response , options ) {
						
					}
				});
		}

		this.buttons = [{
			text : '保存',
			iconCls : 'btn-save',
			handler : function() {
				var fp = Ext.getCmp("${className}Form");
				if (fp.getForm().isValid()) {
					var data = fp.getForm().getValues();
					if(recId){
						data['${classNameLower}.updateBy'] = curUserInfo.username;
						data['${classNameLower}.updateDate'] = new Date().format('Y-m-d H:i');
					}else{
						data['${classNameLower}.createBy'] = curUserInfo.username;
						data['${classNameLower}.createDate'] = new Date().format('Y-m-d H:i');
					}
					Ext.Ajax.request({
							url : __ctxPath + '/pss/save${className}.do',
					    success : function(response , options ) {
							Ext.ux.Toast.msg('信息', '成功保存信息！');
							Ext.getCmp('${className}FormWin').close();
							Ext.getCmp('${className}Grid').getStore().reload();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '信息',
										msg : '數據保存失敗！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
						},
					    params: data
					});
				}
			
			}
		}, {
			text : '清空',
			iconCls : 'btn-reset',
			handler : function() {
				Ext.getCmp('${className}Form').getForm().reset();
			}
		}, {
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('${className}FormWin').close();
			}
		}];
	}
});