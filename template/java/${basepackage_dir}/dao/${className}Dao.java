<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first> 
package ${basepackage}.dao;
import com.abcdef.core.dao.BaseDao;
import ${basepackage}.model.${className};

public interface ${className}Dao extends BaseDao<${className}>{
	
}