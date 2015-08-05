<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first> 
package ${basepackage}.service.impl;

import com.abcdef.core.service.impl.BaseServiceImpl;
import ${basepackage}.service.${className}Service;
import ${basepackage}.dao.${className}Dao;
import ${basepackage}.model.${className};

public class ${className}ServiceImpl extends BaseServiceImpl<${className}> implements ${className}Service{
	@SuppressWarnings("unused")
	private ${className}Dao dao;
	
	public ${className}ServiceImpl(${className}Dao dao) {
		super(dao);
		this.dao=dao;
	}
}