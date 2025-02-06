import json
from random import sample
import requests
from PIL import Image
from io import BytesIO

_INPUT_FILE_ = 'project/scripts/nutrition_data/data.json'
_OUTPUT_FILE_ = 'project/scripts/nutrition_data/recipes_with_nutritional_info_clean.csv'

levels = ['green', 'orange', 'red']
nutrients = ["fat","salt","saturates","sugars"]
class NutrientRow:
    id : str
    url : str
    text : str
    fat_label : int
    salt_label : int
    saturates_label : int
    sugars_label : int

    def __init__(self, entry):
        self.id = entry['id']
        self.url = entry['url_image']
        self.text = ' '.join([x['text'] for x in entry['instructions']]).replace(';', '')
        self.fat_label = levels.index(entry['fsa_lights_per100g']['fat'])
        self.salt_label = levels.index(entry['fsa_lights_per100g']['salt'])
        self.saturates_label = levels.index(entry['fsa_lights_per100g']['saturates'])
        self.sugars_label = levels.index(entry['fsa_lights_per100g']['sugars'])

    def to_csv(self):
        return f'{self.id};{self.url};{self.text};{self.fat_label};{self.salt_label};{self.saturates_label};{self.sugars_label}'


def image_is_accessible(entry):
    try:
        response = requests.get(entry['url_image'], timeout=2)
        if not response.ok:
            return False
        img_bytes = response.content
        Image.open(BytesIO(img_bytes))
    except:
        return False
    else:
        return True

def load_input_file():
    with open(_INPUT_FILE_, 'r') as json_file:
        return json.load(json_file)

if __name__ == '__main__':
    nutrition_data = load_input_file()
    f = open(_OUTPUT_FILE_, 'w', encoding="utf-8")
    f.write('id;url;text;fat_label;salt_label;saturates_label;sugars_label\n')
    i = 0
    for entry in nutrition_data['data']:
        if image_is_accessible(entry):
            row = NutrientRow(entry)
            f.write(row.to_csv()+'\n')
        i = i+1
        if i%10 == 0:
            f.flush()