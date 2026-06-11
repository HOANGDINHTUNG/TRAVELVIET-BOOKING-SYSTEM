import os
import shutil

src_dir = r"d:\Documents\WED_SERVICE\travelviet-booking-system\frontend\web\src"
management_dir = os.path.join(src_dir, "module", "management")

# Files to move and their new destinations
moves = {
    os.path.join(management_dir, "schedules", "utils", "currency.ts"): os.path.join(src_dir, "utils", "currency.ts"),
    os.path.join(management_dir, "schedules", "utils", "scheduleStatus.ts"): os.path.join(src_dir, "utils", "scheduleStatus.ts"),
    os.path.join(management_dir, "tours", "types", "tour.ts"): os.path.join(src_dir, "types", "tour.ts"),
    os.path.join(management_dir, "schedules", "types", "schedule.ts"): os.path.join(src_dir, "types", "schedule.ts"),
    os.path.join(management_dir, "pages", "system", "systemShared.ts"): os.path.join(src_dir, "utils", "systemShared.ts"), # Moving to global utils for simplicity
}

# Perform moves (copy first to ensure safety, will rm -rf management later)
for old_path, new_path in moves.items():
    if os.path.exists(old_path):
        os.makedirs(os.path.dirname(new_path), exist_ok=True)
        shutil.copy2(old_path, new_path)
        print(f"Copied {old_path} to {new_path}")
    else:
        print(f"WARNING: {old_path} not found.")

# Update imports in all frontend files
def get_new_import_path(filepath, new_rel_dest_from_src):
    # e.g., filepath = src/module/tours/pages/ToursPage.tsx
    # new_rel_dest_from_src = utils/currency
    dirpath = os.path.dirname(filepath)
    rel_path_to_src = os.path.relpath(src_dir, dirpath).replace("\\", "/")
    return f"{rel_path_to_src}/{new_rel_dest_from_src}"

replacements = {
    r"../../management/schedules/utils/currency": "utils/currency",
    r"../../../management/schedules/utils/currency": "utils/currency",
    r"../../management/schedules/utils/scheduleStatus": "utils/scheduleStatus",
    r"../../management/tours/types/tour": "types/tour",
    r"../../management/schedules/types/schedule": "types/schedule",
    r"../../../../management/pages/system/systemShared": "utils/systemShared"
}

def update_imports(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if not (file.endswith(".ts") or file.endswith(".tsx")): continue
            filepath = os.path.join(root, file)
            # Don't touch stuff inside management for now, since we are deleting it soon
            if "module\\management" in root: continue
            
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            modified = False
            for old_import, new_rel in replacements.items():
                if old_import in content:
                    # Calculate new path relative to this file
                    new_import_stmt = get_new_import_path(filepath, new_rel)
                    content = content.replace(old_import, new_import_stmt)
                    modified = True
            
            if modified:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {filepath}")

update_imports(src_dir)
print("Done.")
