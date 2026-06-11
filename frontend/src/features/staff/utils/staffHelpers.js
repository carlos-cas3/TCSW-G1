export const filterStaff = (staff, filters) => {
  return staff.filter((member) => {
    const matchSearch = !filters.search
      ? true
      : `${member.first_name} ${member.last_name} ${member.email}`
          .toLowerCase()
          .includes(filters.search.toLowerCase());

    const matchRole =
      !filters.role || filters.role === "all"
        ? true
        : member.role_id === parseInt(filters.role, 10);

    return matchSearch && matchRole;
  });
};

export const getStaffStats = (staff) => ({
  total: staff.length,
  sellers: staff.filter((m) => m.role_id === 3).length,
  supervisors: staff.filter((m) => m.role_id === 4).length,
});
