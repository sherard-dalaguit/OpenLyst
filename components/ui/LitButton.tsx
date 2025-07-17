interface LitButtonProps {
	title: string;
	icon: React.ReactNode;
	position: string;
	handleClick?: () => void;
}

const LitButton = ({ title, icon, position, handleClick }: LitButtonProps) => {
	return (
		<button className="inline-flex p-[3px] relative" onClick={handleClick}>
			<div className="absolute inset-0 bg-gradient-to-br from-main-100 to-main-500 rounded-lg" />
			<div className="inline-flex h-full w-full px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent gap-2">
				{position === 'left' && icon}
				{title}
				{position === 'right' && icon}
			</div>
		</button>
	)
}

export default LitButton;