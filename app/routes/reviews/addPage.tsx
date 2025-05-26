import { useParams } from "react-router";
import AddComponent from "~/components/reviews/addComponent";

function AddPage() {
    const { pno } = useParams()

    return (
        <div>
            <AddComponent></AddComponent>
        </div>
    );
}

export default AddPage;