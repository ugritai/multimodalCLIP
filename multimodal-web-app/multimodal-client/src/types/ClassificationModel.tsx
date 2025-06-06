export type Classification = {
    id: Number,
    user: string,
    dataset: string,
    creation_date: string,
    update_date: string,
    status: string,
    model_name: string,
    parameters: ClassificationParameters,
}

export type ClassificationParameters = {
    mode: string,
    predictor: string,
    fusion_method: string,
    class_column: string,
    descriptions: string[],
    text_column: string,
    image_column: string,
}