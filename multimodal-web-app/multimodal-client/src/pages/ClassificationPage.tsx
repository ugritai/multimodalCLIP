import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Classification } from '@/types/ClassificationModel';
import { ClassificationInfo, ClassificationResult } from '@/api/classifications.api';
import { ReportCharts } from '@/components/classificationPage/ReportCharts';

type MetricRow = {
  label: string;
  [key: string]: number | string;
};

export function ClassificationPage() {
    const { classification_id } = useParams();
    const [classificationInfo, setClassificationInfo] = useState<Classification | null>(null);
    const [classificationResult, setClassificationResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (classification_id) {
        ClassificationInfo(Number(classification_id))
        .then((res) => {
            console.log(res);
            setClassificationInfo(res.data);
        })
        .finally(() => setLoading(false));
    }
    }, [classification_id]);
    
    useEffect(() => {
    if (classification_id) {
        ClassificationResult(Number(classification_id))
        .then((res) => {
            console.log(res.data);
            setClassificationResult(res.data);
        })
        .finally(() => setLoading(false));
    }
    }, [classification_id]);

    if (loading) {
    return <Skeleton className="w-full h-40" />;
    }

    if (!classificationInfo) {
    return <div className="text-red-500">No se pudo cargar la clasificación.</div>;
    }

    function renderHeader(classification: Classification) {
        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <p><strong>Dataset:</strong> {classification.dataset}</p>
                    <p><strong>Estado:</strong> {classification.status}</p>
                    <p><strong>Modelo:</strong> {classification.model_name}</p>
                    <p><strong>Última actualización:</strong> {new Date(classification.update_date).toLocaleString()}</p>
                </div>
            </div>
        );
    }

    function renderParametersCard(classification: Classification) {
        const params = classification.parameters;

        return (
        <Card>
            <CardHeader>
            <h2 className="text-xl font-semibold">Parámetros de Clasificación</h2>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <p><strong>Modo:</strong> {params.mode}</p>
                <p><strong>Predictor:</strong> {params.predictor}</p>
                {params.fusion_method && <p><strong>Método de fusión:</strong> {params.fusion_method}</p>}
                <p><strong>Columna de clase:</strong> {params.class_column}</p>
                {params.text_column && <p><strong>Columna de texto:</strong> {params.text_column}</p>}
                {params.image_column && <p><strong>Columna de imagen:</strong> {params.image_column}</p>}
                <div className="md:col-span-2">
                    <strong>Descripciones:</strong>
                    <ul className="list-disc list-inside mt-1">
                        {params.descriptions.map((desc, i) => (
                        <li key={i}>{desc}</li>
                        ))}
                    </ul>
                </div>
            </div>
            </CardContent>
        </Card>
        );
    }

    function renderReports(classification: Classification, classificationResult: any) {
        if(classification.status === "FINISHED"){
            return <div>{renderSuccessReport(classification.parameters.descriptions, classificationResult.report)}</div>
        }
        else if (classification.status === "ERROR"){
            return <div>{renderFailedReport()}</div>
        }
        return (
            <div>Reporte no disponible</div>
        )
    }

    function renderSuccessReport(descriptions :string[], report :any){
        const precision: MetricRow = { label: "Precision" };
        const recall: MetricRow = { label: "Recall" };
        const f1: MetricRow = { label: "F1" };
        descriptions.forEach((description, _) => {
            const classReport = report[description];

            if (classReport) {
                precision[description] = parseFloat(classReport["precision"] ?? 0).toFixed(3);
                recall[description] = parseFloat(classReport["recall"] ?? 0).toFixed(3);
                f1[description] = parseFloat(classReport["f1-score"] ?? 0).toFixed(3);
            } else {
                precision[description] = 0;
                recall[description] = 0;
                f1[description] = 0;
            }
        });
        return (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                <ReportCharts classes={descriptions} chartData={[precision]}/>
                <ReportCharts classes={descriptions} chartData={[recall]}/>
                <ReportCharts classes={descriptions} chartData={[f1]}/>
            </div>
        )
    }

    function renderFailedReport(){
        return (
            <div>
                ERROR
            </div>
        )
    }

    return (
    <div className="p-6 space-y-6">
        {renderHeader(classificationInfo)}
        {renderParametersCard(classificationInfo)}
        {classificationInfo && classificationResult && renderReports(classificationInfo, classificationResult)}
    </div>
    );
}