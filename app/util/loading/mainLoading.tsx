
const MainLoading = () => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-60">
            <div className="flex w-full items-center bg-white justify-center h-screen">
                <img src="/loading/mainLoadidng.gif"
                     alt="Loading..."
                     className="w-64 h-64"
                />
            </div>
        </div>
    );
};

export {MainLoading};