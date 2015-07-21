<#include "/java_copyright.include">
<#assign className = table.className>   
<#assign classNameLower = className?uncap_first> 
package ${basepackage}.service;

import com.abcdef.core.service.BaseService;
import ${basepackage}.model.${className};

public interface ${className}Service extends BaseService<${className}>{
	
}