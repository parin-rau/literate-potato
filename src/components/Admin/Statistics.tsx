//import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { useEffect } from "react";

type Props = {
	setStatsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type Stat = {
	label: string;
	stat: number;
};

const url = "/api/admin/stats";

function StatCard({ label, stat }: Stat) {
	return (
		<div className="flex flex-col gap-2 p-2 rounded-md">
			<h4>{label}</h4>
			<span>{stat}</span>
		</div>
	);
}

export default function Statistics({ setStatsLoading }: Props) {
	const { data, isLoading } = useInitialFetch<Stat[]>(url);

	useEffect(() => {
		const doneLoading = () => setStatsLoading(false);

		if (!isLoading) doneLoading();
	}, [isLoading, setStatsLoading]);

	return (
		<div className="grid gap-2 p-4 rounded-lg">
			{data.map((d, i) => (
				<StatCard {...{ key: i, label: d.label, stat: d.stat }} />
			))}
		</div>
	);
}
