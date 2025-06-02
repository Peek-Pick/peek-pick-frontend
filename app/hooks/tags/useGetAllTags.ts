import { useEffect, useState } from "react";
import type { TagDTO } from "~/types/tag";
import {getAllTags} from "~/api/tagsAPI";

export function useGetAllTags() {

    const [allTags, setAllTags] = useState<TagDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTags()
            .then(setAllTags)
            .catch(() => alert("태그 사라짐ㅎ"))
            .finally(() => setLoading(false));
    }, []);

    return { allTags, loading };
}
