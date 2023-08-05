import { useState } from "react";

type Props = {
	children:
		| React.JSX.Element
		| React.JSX.Element[]
		| (() => React.JSX.Element);
};

export default function CardContainer(children: Props) {
	return <div>{children}</div>;
}
