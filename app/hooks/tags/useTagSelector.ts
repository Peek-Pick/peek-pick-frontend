import {useEffect, useMemo, useState } from "react";
import { useGetAllTags } from "./useGetAllTags";
import type { TagDTO } from "~/types/tag";

export function useTagSelector(initSelected: number[] = []) {

    const [selectedTags, setSelectedTags] = useState<number[]>(initSelected)
    const {allTags, loading} = useGetAllTags();

    // initSelected가 바뀌면 selectedTags 업데이트
    useEffect(() => {
        setSelectedTags(initSelected);
    }, [initSelected]);

    // 토글 함수
    const toggleTag = (tagId: number)=> {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    }

    // tags를 category별로 그룹핑 (useMemo로 최적화)
    const groupedTags = useMemo(() => {
        if (!allTags) return {};
        return allTags.reduce((acc, tag) => {
            if (!acc[tag.category]) acc[tag.category] = [];
            acc[tag.category].push(tag);
            return acc;
        }, {} as Record<string, TagDTO[]>);
    }, [allTags]);

    console.log("선택된 태그 훅", selectedTags)
    return {
        selectedTags,          // 선택된 tag_id 배열
        toggleTag,             // 토글 함수
        setSelectedTags,       // 직접 설정할 수 있는 함수
        groupedTags,           // 카테고리별 그룹핑된 태그
        loading,               // 로딩 상태
        allTags                // 전체 태그
    };
}