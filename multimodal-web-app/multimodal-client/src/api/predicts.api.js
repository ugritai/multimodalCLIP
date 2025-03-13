import axios from 'axios'

export const predictCsv = (class_column, text_column, image_column, predictor, interpolation, class_descriptions, sample_size, csv_file) => {
    const form = new FormData();
    form.append("class_column", class_column)
    form.append("text_column", text_column)
    form.append("image_column", image_column)
    form.append("predictor", predictor)
    form.append("interpolation", interpolation)
    form.append("class_descriptions", class_descriptions)
    form.append("sample_size", sample_size)
    // form.append("delimiter", "delimiter")
    form.append("csv_file", csv_file)
    console.log(form)
    
    return axios.post("http://127.0.0.1:8000/classifications/predict_csv/", form)
}