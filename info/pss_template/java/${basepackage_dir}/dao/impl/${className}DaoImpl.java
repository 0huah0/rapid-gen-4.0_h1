<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first> 
package ${basepackage}.dao.impl;

import com.abcdef.core.dao.impl.BaseDaoImpl;
import ${basepackage}.dao.${className}Dao;
import ${basepackage}.model.${className};
@SuppressWarnings("unchecked")
public class ${className}DaoImpl extends BaseDaoImpl<${className}> implements ${className}Dao{
	public ${className}DaoImpl() {
		super(${className}.class);
	}
	
}