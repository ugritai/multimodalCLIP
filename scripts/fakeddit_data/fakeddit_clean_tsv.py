
import requests
import pandas as pd
from PIL import Image
from io import BytesIO, StringIO

input_name = 'project/scripts/fakeddit_data/multimodal_test_public.tsv'
output_name = 'project/scripts/fakeddit_data/multimodal_test_public_clean.tsv'
image_column = 'image_url'
skip_rows = 33626


def image_is_accessible(row):
    try:
        response = requests.get(row[image_column], timeout=2)
        if not response.ok:
            return False
        img_bytes = response.content
        Image.open(BytesIO(img_bytes))
    except:
        return False
    else:
        return True
    

if __name__ == '__main__':
    df = pd.read_table(input_name, skiprows=range(1, skip_rows))
    #Remove rows without image_url
    df = df.dropna(subset=[image_column])
    #Remove rows without an accessible image
    f = open(output_name, 'a', encoding="utf-8")
    for index, row in df.iterrows():
        if image_is_accessible(row):
            s = StringIO()
            row.to_csv(s, sep='\t', index=False)
            s_a = str(s.getvalue().replace('\r\n', '\t'))+'\n'
            f.write(s_a)
            s.close()
            
        if index % 10 == 0:
            f.flush()
    f.close()

    # df = df[df.apply(image_is_accessible, axis=1)]

    # df.to_csv(output_name, sep="\t", index=False) 


