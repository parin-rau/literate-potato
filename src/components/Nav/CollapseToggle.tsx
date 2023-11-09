import CollapseIcon from "../Svg/CollapseIcon";
import ToggleButton from "./ToggleButton";

interface Props {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	text: string;
}

export default function CollapseToggle({ isOpen, setOpen, text }: Props) {
	const toggleOpen = () => setOpen((prev) => !prev);

	return (
		<button type="button" onClick={toggleOpen}>
			<ToggleButton>
				<CollapseIcon isCollapsed={!isOpen} />
				{text}
			</ToggleButton>
		</button>
	);
}
