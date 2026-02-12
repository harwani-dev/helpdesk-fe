import { Outlet, useNavigate, useNavigation } from "react-router-dom";
import { Loader } from "@/pages/PageLoader";
import { useEffect, useState } from "react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "../components/custom/sidebar"
import { LogOut, User } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";


export default function MainLayout() {
    const navigation = useNavigation();
    const navigate = useNavigate();
    const isNavigating = navigation.state === "loading";
    const [showLoader, setShowLoader] = useState(true);

    // const { data, isLoading, error } = useQuery({
    //     queryKey: ["user"],
    //     queryFn: async () => {
    //         const token = localStorage.getItem("token");
    //         const response = await axios.get("https://helpdesk-788474910057.asia-south1.run.app/api/users/me", {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });
    //         return response.data
    //     },
    //     retry: false
    // })
    useEffect(() => {
        if (isNavigating) {
            setShowLoader(true);
        } else {
            setShowLoader(false);
        }
    }, [isNavigating]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully")
        navigate("/login")
    }

    return (
        <>
            {/* replace showLoader with isNavigating in prod */}
            {showLoader ? <Loader /> :
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col border-4 border-border">
                            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-4 border-b-border transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                                <div className="flex items-center gap-2 px-4">
                                    <SidebarTrigger className="-ml-1 bg-secondary-background hover:bg-main cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-around gap-4 mr-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div onClick={() => navigate("/profile")} className="cursor-pointer flex items-center justify-center size-9 hover:bg-main rounded-xl transition-colors">
                                                    <User />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Profile</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="cursor-pointer flex items-center justify-center size-9 hover:bg-main rounded-xl transition-colors"
                                                    onClick={handleLogout}>
                                                    <LogOut />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Logout</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </header>
                                <Outlet />
                        </div>
                    </SidebarInset>
                </SidebarProvider>

            }
        </>
    );
}
