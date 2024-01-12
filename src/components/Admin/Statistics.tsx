import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useState } from "react";
import { titleCap } from "../../utility/charCaseFunctions";
import CollapseToggle from "../Nav/CollapseToggle";
import { LoadingSkeletonCard } from "../Nav/Loading";

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
		<div className="flex flex-col gap-2 w-32 h-32 rounded-md bg-slate-200 justify-center items-center dark:bg-neutral-800">
			<h4 className="font-semibold text-lg">{titleCap(label)}</h4>
			<span className="font-normal text-xl">{stat}</span>
		</div>
	);
}

export default function Statistics() {
	const [isOpen, setOpen] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [data, setData] = useState<Stat | null>(null);
	const { protectedFetch } = useProtectedFetch();

	const loadData = async () => {
		const retrieve = async () => {
			const res = await protectedFetch(url);

			if (res.ok) {
				const resData: Stat = await res.json();
				setData(resData);
				setLoading(false);
			}
		};

		if (!isLoading) setLoading(true);
		if (!isOpen) await retrieve();
		setOpen((prev) => !prev);
	};

	return (
		<div className="flex flex-col gap-3 rounded-lg bg-slate-100 dark:bg-neutral-900 p-2 font-semibold text-2xl">
			<CollapseToggle
				{...{ isOpen, setOpen, text: "Statistics", onClick: loadData }}
			/>
			{isOpen &&
				(!isLoading && data ? (
					<div className="flex flex-row gap-3">
						{data.count.map((d, i) => (
							<StatCard
								{...{ key: i, label: d.label, stat: d.count }}
							/>
						))}
					</div>
				) : (
					<LoadingSkeletonCard />
				))}
		</div>
	);
}
