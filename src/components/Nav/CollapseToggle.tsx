import CollapseIcon from "../Svg/CollapseIcon";
import ToggleButton from "./ToggleButton";

interface Props {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	text: string;
	onClick?: () => void;
}

export default function CollapseToggle({
	isOpen,
	setOpen,
	text,
	onClick,
}: Props) {
	const toggleOpen = () => setOpen((prev) => !prev);

	return (
		<ToggleButton type="button" onClick={onClick ?? toggleOpen}>
			<CollapseIcon isCollapsed={!isOpen} />
			{text}
		</ToggleButton>
	);
}
