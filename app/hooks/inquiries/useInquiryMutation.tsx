import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
    createInquiry,
    deleteInquiry,
    updateInquiry
} from "~/api/inquiriesAPI";
import {deleteAdminInquiry} from "~/api/inquiriesAPI";

function invalidateInquiryQueries(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
}

export function useCreateInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: InquiryRequestDTO) => createInquiry(data),
        onSuccess: () => {
            invalidateInquiryQueries(queryClient);
        },
    });
}

export function useUpdateInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InquiryRequestDTO }) =>
            updateInquiry(id, data),
        onSuccess: () => {
            invalidateInquiryQueries(queryClient);
        },
    });
}

export function useDeleteInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteInquiry(id),
        onSuccess: () => {
            invalidateInquiryQueries(queryClient);
        },
    });
}

export function useDeleteAdminInquiry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteAdminInquiry(id),
        onSuccess: () => {
            invalidateInquiryQueries(queryClient);
        },
    });
}