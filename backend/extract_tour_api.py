import re
import os

java_dir = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\src\main\java\com\wedservice\backend\module\tours"
out_file = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\TOUR_API.md"

out = []
out.append("### API ENDPOINTS - TOURS\n\n")
out.append("| STT | Phương thức | Đường dẫn URL | Quyền truy cập | DTO Đầu vào | ApiResponse Đầu ra | Chú thích (Controller) |\n")
out.append("|-----|-------------|---------------|----------------|-------------|--------------------|-------------------------|\n")

stt = 1
for root, dirs, files in os.walk(java_dir):
    for f in files:
        if f.endswith("Controller.java"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
                
                base_path = ""
                rm_match = re.search(r'@RequestMapping\(\s*["\']([^"\']+)["\']\s*\)', content)
                if not rm_match:
                    rm_match = re.search(r'@RequestMapping\(\s*value\s*=\s*["\']([^"\']+)["\'].*?\)', content)
                if rm_match:
                    base_path = rm_match.group(1)
                
                global_auth = "Mặc định (User/Public)"
                if "@PreAuthorize" in content.split("class ")[0]:
                    global_auth = "Có @PreAuthorize"
                
                methods = re.findall(r'(@(Get|Post|Put|Patch|Delete)Mapping\([^)]*\)[^{]+)', content)
                for method_str, m_type in methods:
                    path_match = re.search(r'value\s*=\s*["\']([^"\']+)["\']', method_str) or re.search(r'["\']([^"\']+)["\']', method_str)
                    sub_path = path_match.group(1) if path_match else ""
                    full_path = (base_path + sub_path).replace("//", "/")
                    
                    auth = global_auth
                    if "@PreAuthorize" in method_str:
                        auth_match = re.search(r'@PreAuthorize\s*\(\s*["\']([^"\']+)["\']\s*\)', method_str)
                        if auth_match:
                            auth = f"{auth_match.group(1)}"
                    elif "@PermitAll" in method_str:
                        auth = "PermitAll"
                    
                    req_bound = "N/A"
                    req_match = re.search(r'@RequestBody\s+([A-Za-z0-9_<>]+)', method_str)
                    if req_match:
                        req_bound = req_match.group(1)
                    elif "@RequestParam" in method_str or "@PathVariable" in method_str:
                        req_bound = "Params"
                        
                    res_bound = "ApiResponse"
                    res_match = re.search(r'ResponseEntity<([^>]+)>', method_str) or re.search(r'ApiResponse<([^>]+)>', method_str)
                    if res_match:
                        res_bound = res_match.group(1)
                        
                    out.append(f"| {stt} | `{m_type.upper()}` | `{full_path}` | {auth} | `{req_bound}` | `{res_bound}` | {f} |\n")
                    stt += 1

with open(out_file, "w", encoding="utf-8") as f:
    f.write("".join(out))

print("Created TOUR_API.md")
