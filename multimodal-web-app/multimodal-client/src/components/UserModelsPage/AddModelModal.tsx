import { TabsList, Tabs, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { AddHuggingFaceTab } from "./AddHuggingFaceTab";

export function AddModelModal(
{
    setReloadDatasets,
    setShowModal
} : 
{ 
    setReloadDatasets : React.Dispatch<React.SetStateAction<never[]>>,
    setShowModal : React.Dispatch<React.SetStateAction<boolean>>
}) 
{
    return  (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-full overflow-auto">
                <Tabs defaultValue="uploadHuggingface">
                    <TabsList>
                        <TabsTrigger value="uploadHuggingface">HugginFace</TabsTrigger>
                    </TabsList>
                    <TabsContent value="uploadHuggingface">
                        <AddHuggingFaceTab setReloadDatasets={setReloadDatasets} setShowModal={setShowModal}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>)
}