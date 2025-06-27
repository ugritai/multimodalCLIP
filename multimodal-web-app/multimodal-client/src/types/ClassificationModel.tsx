export type Classification = {
    id: number,
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

export type ClassificationUploadRequest = {
    dataset_id: number,
    mode: string | undefined,
    predictor: string | undefined,
    fusion_method: string | undefined,
    model_name: string | undefined,
    class_column: string | undefined,
    descriptions: string[] | undefined,
    text_column: string | undefined,
    image_column: string | undefined,
}