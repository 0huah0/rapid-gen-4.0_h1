<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first>
<#assign actionExtension = "do">
package ${basepackage}.action;

import java.util.List;
import javax.annotation.Resource;
import com.abcdef.core.command.QueryFilter;
import com.abcdef.core.web.action.BaseAction;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
		try {
			${classNameLower}Service.save(${classNameLower});
		} catch (Exception e) {
			e.printStackTrace();
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				try {
					${classNameLower}Service.remove(new Long(id));
				} catch (NumberFormatException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}

		jsonString = "{success:true}";
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		String id = getRequest().getParameter("id");
		${className} ${classNameLower} = ${classNameLower}Service.get(new Long(id));

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(${classNameLower}));
		sb.append("}");
		setJsonString(sb.toString());

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
