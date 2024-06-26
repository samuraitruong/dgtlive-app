import { ReactElement } from "react";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }: { children: ReactElement }) {
    return (<main className="flex min-h-screen flex-col items-center  bg-gray-100 text-black">
        <AdminHeader></AdminHeader>
        <div className="p-3 w-full ">
            {children}
        </div>
    </main>)
}