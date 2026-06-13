import pandas as pd
import json
from generate_data_rev1 import generate_variations

def export_to_csv(n=500, filename="sample_data_500.csv"):
    print(f"Generating {n} variations...")
    # Generate the data
    data = generate_variations(n)
    
    # Process into a flat structure for pandas
    records = []
    for item in data:
        text = item[0]
        # Convert entities to a JSON string so they fit cleanly in a CSV cell
        entities = json.dumps(item[1]["entities"])
        records.append({"text": text, "entities": entities})
        
    # Create DataFrame and export
    df = pd.DataFrame(records)
    df.to_csv(filename, index=False, encoding='utf-8')
    print(f"Successfully exported {len(df)} records to {filename}")

if __name__ == "__main__":
    export_to_csv(500, "sample_data_500.csv")
