import json
import re
import os

# check if json files in folder are valid 
# and structure in the json is "X": { "title": "Y" with X == Y 
# (Inequality is often caused by copy and paste)
def check_json_titles_with_strict_structure(folder_path):
    all_mismatches = []

    # Function to recursively traverse directories
    def traverse_directory(directory):
        for entry in os.scandir(directory):
            if entry.is_file() and entry.name.endswith('.json'):
                check_json_file(entry.path)
            elif entry.is_dir():
                traverse_directory(entry.path)

    # Function to check a single JSON file
    def check_json_file(file_path):
        mismatched_titles = []

        # Function to recursively check dictionaries
        def check_dict(obj, parent_key=''):
            for key, value in obj.items():
                full_key = f"{parent_key}.{key}" if parent_key else key
                if isinstance(value, dict):
                    if 'title' in value and key != value['title']:
                        mismatched_titles.append((full_key, value['title']))
                    check_dict(value, full_key)

        # Open and parse the JSON file
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                check_dict(data)
        except json.JSONDecodeError as e:
            print(f"invalid json: {os.path.basename(file_path)}")
            return

        # Re-opening the file as plain text to check for valid mismatches
        with open(file_path, 'r') as file:
            file_content = file.read()
            for mismatch in mismatched_titles:
                full_key = mismatch[0]
                title = mismatch[1]
                # Regex to find the strict structure where <A> and <B> should not match
                pattern = rf'"{full_key.split(".")[-1]}"\s*:\s*\{{[^{{}}]*"title"\s*:\s*"{title}"[^{{}}]*\}}'
                if re.search(pattern, file_content):
                    all_mismatches.append((os.path.relpath(file_path, folder_path), full_key, title))

    traverse_directory(folder_path)
    return all_mismatches


# Example usage
folder_path = "Visual-Programming-React-Component-Suite-rf-code-generation"
# folder_path = "path/to/your/json/files/folder"

mismatches = check_json_titles_with_strict_structure(folder_path)
for mismatch in mismatches:
    print(f"Mismatch found in {mismatch[0]}: Key '{mismatch[1]}' has title '{mismatch[2]}'")
