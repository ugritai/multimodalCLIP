import { DeleteDataset } from "@/api/datasets.api";

export function ConfirmDeleteModal(
    {
        setReloadDatasets,
        setShowModal,
        dataset
    } :
    {
        setReloadDatasets : React.Dispatch<React.SetStateAction<never[]>>,
        setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
        dataset : any
    })
    {
        const deleteDataset = (dataset : any) => {
            DeleteDataset(dataset.dataset_id)
            .then(() => {
                setReloadDatasets([]);
                setShowModal(false);
            })
            .catch((error) => {
                alert(`Failed to delete ${dataset.dataset_name}`)
                console.log(error);
            })
        }
        return  (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-m font-semibold mb-4">Esta acción es irreversible. ¿Está seguro que quiere borrar este dataset?</h2>
                <button
                onClick={() => deleteDataset(dataset)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                Eliminar
                </button>
                <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                Cancelar
                </button>
            </div>
        </div>)
    }