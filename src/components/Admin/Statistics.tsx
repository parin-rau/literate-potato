//import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { useEffect } from "react";

/*

Wrap entire container in collapsable 

*/

type Props = {
	setStatsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type Stat = {
	count: { label: string; count: number }[];
};

type CProps = {
	label: string;
	stat: number;
};

const url = "/api/admin/stats";

function StatCard({ label, stat }: CProps) {
	return (
		<div className="flex flex-col gap-2 p-2 rounded-md">
			<h4>{label}</h4>
			<span>{stat}</span>
		</div>
	);
}

export default function Statistics({ setStatsLoading }: Props) {
	const { data, isLoading } = useInitialFetch<Stat>(url);

	useEffect(() => {
		if (!isLoading) setStatsLoading(false);
	}, [isLoading, setStatsLoading]);

	return (
		<div className="grid grid-cols-4 gap-2 p-4 rounded-lg">
			{!isLoading &&
				data.count.map((d, i) => (
					<StatCard {...{ key: i, label: d.label, stat: d.count }} />
				))}
		</div>
	);
}
