import { HashLoader } from "react-spinners";

export default function Loading() {
    return (

        <div className="flex justify-center items-center h-screen opacity-40 bg-slate-100">
            <div>
                <HashLoader color="#36d7b7" />
            </div>
        </div>

    )
}