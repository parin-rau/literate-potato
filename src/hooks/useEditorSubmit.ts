import { useState, useCallback } from "react";

type SubmitMetadata = {
	dataKind: "ticket" | "project";
	isEdit?: boolean;
	isProjectMove?: boolean;
	isTasksEdit?: boolean;
};

export function useSubmitHelper() {
	const [submitMeta, setSubmitMeta] = useState<SubmitMetadata | null>(null);

	const submitHelper = useCallback(async (input: SubmitMetadata) => {
		switch (input) {
			case { dataKind: "project", isEdit: true }:
				// Edit project
				break;
			case { dataKind: "project", isEdit: false }:
				// create project
				break;
			case { dataKind: "ticket", isEdit: true }:
				// edit ticket
				break;
			case { dataKind: "ticket", isProjectMove: true }:
				// move ticket to different project
				break;
			case { dataKind: "ticket", isTasksEdit: true }:
				// edit/add/delete tasks from ticket and project
				break;
			case { dataKind: "ticket", isEdit: false }:
				// create ticket
				break;
			default:
				break;
		}
	}, []);

	return { setSubmitMeta, submitHelper };
}
