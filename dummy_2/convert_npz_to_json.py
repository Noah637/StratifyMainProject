import numpy as np
import json
import os

# Directory containing the .npz files
data_dir = './synthetic_rockfall_data[1]'
# Output directory for JSON files
output_dir = './synthetic_rockfall_data_json'
os.makedirs(output_dir, exist_ok=True)

for fname in os.listdir(data_dir):
    if fname.endswith('.npz'):
        npz_path = os.path.join(data_dir, fname)
        data = np.load(npz_path)
        # Assume the DEM is stored under the first key
        key = list(data.keys())[0]
        arr = data[key]
        # Convert to list for JSON serialization
        arr_list = arr.tolist()
        # Save as JSON
        json_path = os.path.join(output_dir, fname.replace('.npz', '.json'))
        with open(json_path, 'w') as f:
            json.dump(arr_list, f)
print('Conversion complete!')
