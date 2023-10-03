import HamburgerToggle from "./HamburgerToggle";
import SignInButton from "./SignInButton";

type Props = {
	isOpenSidebar: boolean;
	handleSidebarToggle: (_v?: boolean) => void;
};

export default function SidebarRight({
	isOpenSidebar,
	handleSidebarToggle,
}: Props) {
	return (
		isOpenSidebar && (
			<>
				<div
					className="fixed z-40 w-screen h-screen bg-neutral-700 opacity-50 "
					onClick={() => handleSidebarToggle(false)}
				/>
				<div className="fixed z-50 top-0 right-0 h-screen w-32 m-0 p-2 flex flex-col gap-2 items-end dark:bg-neutral-900 bg-slate-100 border-l dark:border-l-neutral-800 border-l-slate-200">
					<HamburgerToggle onClick={handleSidebarToggle} />
					<SignInButton />
				</div>
			</>
		)
	);
}
