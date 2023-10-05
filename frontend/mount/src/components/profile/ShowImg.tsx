type Prop = {
    pictures: string;
};

function ShowImg({ pictures }: Prop) {
	const link: string = `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${pictures}`
    return (
        <>
            <img
                className="w-20 h-20 object-cover"
                src={link}
                alt="image description"
            />
        </>
    );
}

export default ShowImg;
