export const extractEditableData = (data) => ({
    companyName: data?.profile?.companyName ?? "",
    phone: data?.profile?.phone ?? "",
    address: data?.profile?.address ?? "",
    policyDescription:
        data?.returnPolicy?.description ?? "",
});