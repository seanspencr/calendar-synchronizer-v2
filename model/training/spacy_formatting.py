import os
import random
from generate_data_rev1 import generate_variations, convert_to_spacy_binary

RANDOM_SEED = 42
DATA_DIR = "./data"


def main(n: int = 10000):
    random.seed(RANDOM_SEED)
    os.makedirs(DATA_DIR, exist_ok=True)

    total = n
    train_size = int(total * 0.8)
    dev_size = total - train_size

    print(f"Generating {total} samples ({train_size} train / {dev_size} dev)")
    train_data = generate_variations(train_size)
    dev_data = generate_variations(dev_size)

    train_path = os.path.join(DATA_DIR, "train.spacy")
    dev_path = os.path.join(DATA_DIR, "dev.spacy")

    train_before = len(train_data)
    convert_to_spacy_binary(train_data, train_path)

    dev_before = len(dev_data)
    convert_to_spacy_binary(dev_data, dev_path)

    print(f"\nSummary:")
    print(f"  Total generated: {total}")
    print(f"  Train: {train_before} → {train_path}")
    print(f"  Dev:   {dev_before} → {dev_path}")


if __name__ == "__main__":
    main()
