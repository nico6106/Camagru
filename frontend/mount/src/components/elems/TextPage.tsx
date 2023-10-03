
type Prop = {
	center?: boolean;
}
function TextPage({ children, center=false }: any) {
	const styleType: string = `mt-10 sm:mx-auto sm:w-full sm:max-w-sm ${center && 'text-center'}`
    return (
        <div className={styleType}>
            {children}
        </div>
    );
}

export default TextPage;
