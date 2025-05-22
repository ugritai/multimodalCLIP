type Props<T> = {
        setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
        deleteFunction : (element : T) => void,
        elementToDelete : T
}

export function ConfirmDeleteModal<T>(
    {setShowModal, deleteFunction, elementToDelete} :Props<T>)
    {
        const handleConfirm = () => {
            deleteFunction(elementToDelete);
            setShowModal(false);
        }

        return  (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-m font-semibold mb-4">Esta acción es irreversible. ¿Está seguro que quiere borrarlo?</h2>
                <div className="flex gap-1">
                    <button
                    onClick={handleConfirm}
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
                
            </div>
        </div>)
    }