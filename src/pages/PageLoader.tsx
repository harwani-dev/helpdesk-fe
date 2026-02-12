import { LoaderFive } from "@/components/ui/loader";

export function Loader() {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoaderFive text="Loading..." />
        </div>
    )
}