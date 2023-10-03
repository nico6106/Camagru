import { Link } from "react-router-dom";

type Prop = {
	firstText?: string;
	linkText: string;
	link: string;
	space?: string;
}

function LinkText({ firstText, linkText, link, space = '10' }: Prop) {
	const styleDiv: string = `mt-${space} text-center text-sm text-gray-500`
	return (<div className={styleDiv}>
	{firstText}{' '}
	<p className="inline-block font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
		<Link to={link}>{linkText}</Link>
	</p>
</div>);
}

export default LinkText;