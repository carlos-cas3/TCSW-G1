export const extractEditableData = (data) => ({
    companyName: data?.profile?.companyName ?? "",
    personal_phone: data?.profile?.personal_phone ?? "",
    address: data?.profile?.address ?? "",
    policyDescription:
        data?.returnPolicy?.description ?? "",
});