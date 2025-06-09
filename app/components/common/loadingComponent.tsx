
interface LoadingComponentProps {
    isLoading:boolean
}

export default function LoadingComponent({ isLoading } :LoadingComponentProps ) {

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
             style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}  >
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-xl font-semibold mb-2">처리중</div>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-opacity-75 mx-auto" />
            </div>
        </div>
    );
}