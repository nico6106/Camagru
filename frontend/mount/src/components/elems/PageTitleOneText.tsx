import TitleSmall from '../elems/TitleSmall';
import LinkText from '../elems/LinkText';
import TramePage from '../elems/TramePage';
import TextPage from '../elems/TextPage';

type Prop = {
	title: string;
	textBody: string;
}

function PageTitleOneText({title, textBody}: Prop) {
    return (
		<TramePage>
            <TitleSmall text={title} />
			<TextPage>
                <p>{textBody}</p>
				<LinkText
                    linkText="Get back home"
                    link="/"
					space='1'
                />
			</TextPage>
		</TramePage>
    );
}

export default PageTitleOneText;
