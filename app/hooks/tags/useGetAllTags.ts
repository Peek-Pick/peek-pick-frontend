import { useEffect, useState } from "react";
import type { TagDTO } from "~/types/tag";
import {getAllTags} from "~/api/tagsAPI";
import {useNavigate} from "react-router";

export function useGetAllTags() {

    const navigate = useNavigate();

    const [allTags, setAllTags] = useState<TagDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTags()
            .then(setAllTags)
            .catch(() => {
                alert("Missing tags")
                navigate('/signup')
            })
            .finally(() => setLoading(false));
    }, []);

    return { allTags, loading };
}
