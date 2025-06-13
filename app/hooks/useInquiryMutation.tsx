import { useQueryClient } from "@tanstack/react-query";
import {
    createInquiry,
    deleteImages,
    deleteInquiry,
    updateInquiry,
    uploadImages,
} from "~/api/inquiriesAPI";
import type { InquiryRequestDTO } from "~/types/inquiries";
import { useMutation } from "@tanstack/react-query";

export function useCreateInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: InquiryRequestDTO) => createInquiry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        },
    });
}

export function useUpdateInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InquiryRequestDTO }) =>
            updateInquiry(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        },
    });
}

export function useDeleteInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteInquiry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        },
    });
}

export function useUploadImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ inquiryId, files }: { inquiryId: number; files: File[] | FileList }) =>
            uploadImages(inquiryId, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        },
    });
}

export function useDeleteImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ inquiryId, urls }: { inquiryId: number; urls: string[] }) =>
            deleteImages(inquiryId, urls),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inquiries"] });
        },
    });
}