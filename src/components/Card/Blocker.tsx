import { ReactNode } from "react";

type Props = {
	renderChildren: boolean;
	children: ReactNode;
};

export default function Blocker({ children, renderChildren }: Props) {
	return renderChildren && children;
}
