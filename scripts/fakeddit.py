import requests
import pandas as pd
from sklearn.metrics import classification_report
from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
import torch
from PIL import Image
from io import BytesIO

_SAMPLE_SIZE_ = 300

class ZeroTwoPredictor:
    def __init__(self):
        checkpoint = "openai/clip-vit-large-patch14"
        self.model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
        self.processor = AutoProcessor.from_pretrained(checkpoint)

    def predict(self, image, labels):
            inputs = self.processor(images=image, text=labels, return_tensors="pt", padding=True)
            with torch.no_grad():
                outputs = self.model(**inputs)

            logits = outputs.logits_per_image[0]
            probs = logits.softmax(dim=-1).numpy()
            scores = probs.tolist()

            return scores.index(max(scores))

class ImageClassification:
    url : str
    title : str
    label : int
    def __init__(self, url, label, title):
        self.url = url
        self.label = label
        self.title = title


def compute_accuracy(images, labels):
    predictor = ZeroTwoPredictor()
    predictions = list()
    for i in range(len(images)):
        req_content = requests.get(images[i].url).content
        prediction = predictor.predict(Image.open(BytesIO(req_content)), labels)
        predictions.append(prediction)
    img_labels = [img.label for img in images]
    print(f'Samples: {len(images)}')
    print(f'Labels: {labels}')
    print(f'Accuracy: {classification_report(img_labels, predictions, target_names=labels)}')

def process_dataset(
        dataset,
        delimiter: str,
        sample_size: int,
        image_column: str,
        text_column: str,
        class_column: str,
        labels: list,
        index_col=False
):
    df = pd.read_table(dataset, delimiter=delimiter, index_col=index_col)
    dfg = df.groupby(class_column)
    df_sample = dfg.sample(int(sample_size/dfg.ngroups))
    images = df_sample.apply(lambda row: ImageClassification(row[image_column], row[class_column], row[text_column]), axis=1).to_list()
    compute_accuracy(images, labels)


def fakeddit():
    labels = ["This new is true","This new is fake with true text","This new is fake with false text"]
    with open('project/scripts/multimodal_test_public_clean.tsv', 'r', encoding="utf-8") as f:
        process_dataset(f, '\t', _SAMPLE_SIZE_, 'image_url', 'clean_title', '3_way_label', labels, False)


def nutrition():
    nutrients = ['fat', 'salt','saturates', 'sugars']
    for nutrient in nutrients:
        labels = [f"This recipe is low in {nutrient}", f"This recipe is neither low nor high in {nutrient}", f"This recipe is high in {nutrient}"]
        with open('project/scripts/nutrition_data/recipes_with_nutritional_info_clean.csv', 'r', encoding="utf-8") as f:
            process_dataset(f, ';', _SAMPLE_SIZE_, 'url', 'text', f'{nutrient}_label', labels, False)

if __name__ == '__main__':
    # fakeddit()
    nutrition()