type T = {
	[key: number]: string;
};

export const statusCodeLookup: T = {
	250: "Unauthorized access. Must be a member of this group to view this resource.",
	251: "Resource does not exist.",
};
