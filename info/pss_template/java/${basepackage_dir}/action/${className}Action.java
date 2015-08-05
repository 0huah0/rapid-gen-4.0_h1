<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first>
<#assign actionExtension = "do">
<#list table.columns as c>
    <#if !pkColumn?? && c.pk >
				<#assign pkColumn = c />
    </#if>
</#list>
package ${basepackage}.action;

import java.util.List;
import javax.annotation.Resource;
import com.abcdef.core.command.QueryFilter;
import com.abcdef.core.web.action.BaseAction;
import flexjson.JSONSerializer;
import ${basepackage}.model.${className};
import ${basepackage}.service.${className}Service;

public class ${className}Action extends BaseAction {
	@Resource
	private ${className}Service ${classNameLower}Service;
	
	private ${className} ${classNameLower};
	
	public void set${className}(${className} ${classNameLower}) {
		this.${classNameLower} = ${classNameLower};
	}
	
	public ${className} get${className}() {
		return this.${classNameLower};
	}
	
	
	/**
	 * 記錄的新增和修改
	 */
	public String save() {
		boolean sus = true;
		try {
			${classNameLower}Service.save(${classNameLower});
		} catch (Exception e) {
			sus = false;
			e.printStackTrace();
		}
		setJsonString("{success:"+sus+"}");
		return SUCCESS;
	}
	
	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {
		boolean sus = true;
		try {
		<#if pkColumn?? && pkColumn.javaType=='java.lang.String'>
				String ids = getRequest().getParameter("ids");
				if (ids != null  && ids.length() > 0) {
					QueryFilter filter = new QueryFilter(getRequest());
					filter.addFilter("Q_${pkColumn.columnNameLower}_S_SIN", ids);
					List<${className}> list = ${classNameLower}Service.getAll(filter);
					for (${className} ${classNameLower} : list) {
							${classNameLower}Service.remove(${classNameLower});
					}
				}
		<#else>
				String[] ids = getRequest().getParameterValues("ids");
				if (ids != null && ids.length > 0) {
					for (String id : ids) {
							${classNameLower}Service.remove(new Long(id));
					}
				}
		</#if>
				
		} catch (NumberFormatException e) {
			sus = false;
			e.printStackTrace();
		} catch (Exception e) {
			sus = false;
			e.printStackTrace();
		}
		setJsonString("{success:"+sus+"}");
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		String id = getRequest().getParameter("id");
		
	<#if pkColumn?? && pkColumn.javaType=='java.lang.String'>
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_${pkColumn.columnNameLower}_S_EQ", id);
		List<${className}> list = ${classNameLower}Service.getAll(filter);
		${className} ${classNameLower} = new ${className}();
		if(list.size() != 0){
			${classNameLower} = list.get(0);
		}
	<#else>
		${className} ${classNameLower} = ${classNameLower}Service.get(new Long(id));
	</#if>
 
		// 将数据转成JSON格式
		StringBuffer buff = new StringBuffer("{success:true,data:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.serialize(${classNameLower}));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	
	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		List<${className}> list = ${classNameLower}Service.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.serialize(list));

		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	
}
