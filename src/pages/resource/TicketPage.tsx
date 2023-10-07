import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/useInitialFetch";
import { FetchedTicketData } from "../../types";
import TicketCard from "../../components/Card/TicketCard";

export default function TicketPage() {
	const ticketId = useParams().id || "";

	const arrayTransform = useCallback((p: FetchedTicketData) => [p], []);

	const {
		data: card,
		setData: setCard,
		isLoading,
	} = useInitialFetch<FetchedTicketData[], FetchedTicketData>(
		`/api/ticket/${ticketId}`,
		undefined,
		arrayTransform
	);

	return (
		<div className="pt-20">
			<div className="container mx-auto flex flex-col bg-transparent px-2 py-2 rounded-lg space-y-1">
				{!isLoading && (
					<TicketCard cardData={card[0]} setCards={setCard} />
				)}
			</div>
		</div>
	);
}