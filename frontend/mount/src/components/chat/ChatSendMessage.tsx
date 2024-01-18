import { useContext, useState, ChangeEvent } from 'react';
import MultiplesInputOneRow from '../elems/MultiplesInputOneRow';
import { ErrorField } from '..//elems/ErrorFields';
import { WebsocketContext } from '../../context/WebsocketContext';
import { DateInputField } from '..//elems/DateInputField';
import { useUserContext } from '../../context/UserContext';

type PropChatSend = {
    currChat: number;
};

export type DataSocketChatServ = {
    type: string;
    idChat: number;
    message: string;
};

function ChatSendMessage({ currChat }: PropChatSend) {
    const socket = useContext(WebsocketContext);
    const [msg, setMsg] = useState<string>('');
    const { user } = useUserContext();
    const [datePopUp, setPopUp] = useState<boolean>(false);
    const [longitude, setLongitude] = useState<string>('');
    const [latitude, setLatitude] = useState<string>('');
    const [dateDate, setDatebirth] = useState<string>('');
    const [dateTime, setDateTime] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const [imageUpdate, setImageUpdate] = useState<string | null>(null);

    function handleSendMessage(event: any) {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;

        if (event) {
            event.preventDefault();
        }
        if (msg === '' && !imageUpdate) return;
        if (imageUpdate) {
            const newMsg: DataSocketChatServ = {
                type: 'image',
                idChat: currChat,
                message: imageUpdate,
            };
            socket.emit('chat-serv', newMsg);
        }
        if (msg !== '') {
            if (youtubeRegex.test(msg)) {
                const newMsg: DataSocketChatServ = {
                    type: 'video',
                    idChat: currChat,
                    message: `https://www.youtube.com/embed/${youtubeRegex.exec(msg)![1]}`,
                };
                socket.emit('chat-serv', newMsg);
            } else {
                const newMsg: DataSocketChatServ = {
                    type: 'text',
                    idChat: currChat,
                    message: msg,
                };
                socket.emit('chat-serv', newMsg);
            }
        }
        setMsg('');
        setImageUpdate(null);
    }

    function handlePicture(e: ChangeEvent<HTMLInputElement>) {
        const selectedImage = e.target.files?.[0];
        if (selectedImage && selectedImage.size < 500000) {
            const reader = new FileReader();
            if (
                selectedImage.type !== 'image/jpeg' &&
                selectedImage.type !== 'image/png' &&
                selectedImage.type !== 'image/jpg'
            ) {
                setError('Wrong format');
                return;
            }
            reader.onload = () => {
                setImageUpdate(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
            setError('');
        } else {
            setError('Image too big');
        }
    }

    function handleDateTime(e: React.ChangeEvent<HTMLInputElement>) {
        setDateTime(e.target.value);
    }

    function handlePopUp() {
        setImageUpdate(null);
        setIsCheck(false);
        setLatitude('');
        setLongitude('');
        setPopUp(!datePopUp);
    }

    function handleImageUpdate() {
        setImageUpdate(null);
    }

    function handleCheck() {
        if (!user) return;
        setIsCheck(!isCheck);
        if (isCheck) {
            setLongitude('');
            setLatitude('');
        } else {
            setLongitude(user.position.longitude.toString());
            setLatitude(user.position.latitude.toString());
        }
    }

    function handleNewDate() {
        if (
            longitude === '' ||
            latitude === '' ||
            dateDate === '' ||
            dateTime === ''
        )
            return;
        const newMsg: DataSocketChatServ = {
            type: 'date',
            idChat: currChat,
            message: `${dateDate}/${dateTime}/${latitude}/${longitude}`,
        };
        socket.emit('chat-serv', newMsg);
        setLongitude('');
        setLatitude('');
        setDatebirth('');
        setDateTime('');
        setPopUp(false);
    }

    function getTodayDate(): string {
        const today = new Date();
        const day: string = `${
            today.getDate() < 9 ? '0' : ''
        }${today.getDate()}`;
        const month: string = `${today.getMonth() + 1 < 9 ? '0' : ''}${
            today.getMonth() + 1
        }`;
        const dateString: string = `${today.getFullYear()}-${month}-${day}`;
        return dateString;
    }

    function handleOnBlur(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMsg(e.target.value);
    }

    function handleOnChangeDateRV(e: React.ChangeEvent<HTMLInputElement>) {
        setDatebirth(e.target.value);
    }

    function handleOnChangeLatitude(e: React.ChangeEvent<HTMLInputElement>) {
        setLatitude(e.target.value);
    }

    function handleOnChangeLongitude(e: React.ChangeEvent<HTMLInputElement>) {
        setLongitude(e.target.value);
    }

    return (
        <form>
            <label htmlFor="chat" className="sr-only">
                Your message
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                <textarea
                    id="chat"
                    rows={2}
                    className="block mr-3 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Your message..."
                    value={msg}
                    onBlur={(e) => {
                        handleOnBlur(e);
                    }}
                    onChange={(e) => handleOnBlur(e)}
                ></textarea>
                <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
                    onClick={handleSendMessage}
                >
                    <svg
                        className="w-5 h-5 rotate-90"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                    >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                </button>
            </div>
            <div className="flex px-3 rounded-lg bg-gray-50">
                <button
                    type="button"
                    className="row h-12 text-gray-900 bg-white hover:bg-gray-300 hover:border-gray-300 shadow-md border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                    onClick={handlePopUp}
                >
                    <svg
                        className="w-6 h-6 me-2"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M17 11C14.2386 11 12 13.2386 12 16C12 18.7614 14.2386 21 17 21C19.7614 21 22 18.7614 22 16C22 13.2386 19.7614 11 17 11ZM17 11V9M2 9V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.0799 19 5.2 19H13M2 9V8.2C2 7.0799 2 6.51984 2.21799 6.09202C2.40973 5.71569 2.71569 5.40973 3.09202 5.21799C3.51984 5 4.0799 5 5.2 5H13.8C14.9201 5 15.4802 5 15.908 5.21799C16.2843 5.40973 16.5903 5.71569 16.782 6.09202C17 6.51984 17 7.0799 17 8.2V9M2 9H17M5 3V5M14 3V5M15 16H17M17 16H19M17 16V14M17 16V18"
                            stroke={!datePopUp ? '#FF0000' : '#000000'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-sm font-bold">
                        {!datePopUp ? 'Create a new date' : 'Cancel'}
                    </p>
                </button>
                {!datePopUp && (
                    <div className="relative row h-12 text-gray-900 bg-white hover:bg-gray-300 hover:border-gray-300 shadow-md border font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center me-2 mb-2">
                        {imageUpdate && (
                            <button type="button" onClick={handleImageUpdate}>
                                <svg
                                    className="w-7 h-7"
                                    viewBox="-0.96 -0.96 33.92 33.92"
                                    stroke="#000000"
                                    strokeWidth="1.6"
                                >
                                    <path
                                        fill="#000000"
                                        d="M16,0C11.726,0,7.708,1.664,4.687,4.687C1.665,7.708,0,11.727,0,16s1.665,8.292,4.687,11.313 C7.708,30.336,11.726,32,16,32s8.292-1.664,11.313-4.687C30.335,24.292,32,20.273,32,16s-1.665-8.292-4.687-11.313 C24.292,1.664,20.274,0,16,0z M26.606,26.606C23.773,29.439,20.007,31,16,31s-7.773-1.561-10.606-4.394S1,20.007,1,16 S2.561,8.227,5.394,5.394S11.993,1,16,1s7.773,1.561,10.606,4.394S31,11.993,31,16S29.439,23.773,26.606,26.606z"
                                    ></path>
                                    <path
                                        fill="#000000"
                                        d="M22.01,9.989c-0.195-0.195-0.512-0.195-0.707,0L16,15.293l-5.303-5.304c-0.195-0.195-0.512-0.195-0.707,0 s-0.195,0.512,0,0.707L15.293,16L9.99,21.304c-0.195,0.195-0.195,0.512,0,0.707c0.098,0.098,0.226,0.146,0.354,0.146 s0.256-0.049,0.354-0.146L16,16.707l5.303,5.304c0.098,0.098,0.226,0.146,0.354,0.146s0.256-0.049,0.354-0.146 c0.195-0.195,0.195-0.512,0-0.707L16.707,16l5.303-5.304C22.206,10.501,22.206,10.185,22.01,9.989z"
                                    ></path>
                                </svg>
                            </button>
                        )}
                        {!imageUpdate && (
                            <div className="row text-center inline-flex items-center">
                                <svg
                                    className="w-7 h-7"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M18.22 19.9628C17.8703 20 17.4213 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.7157 19.5903 4.40973 19.2843 4.21799 18.908C4.12583 18.7271 4.07264 18.5226 4.04193 18.2622M18.22 19.9628C18.5007 19.9329 18.7175 19.8791 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M18 9V6M18 6V3M18 6H21M18 6H15"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <input
                                    id="update-avatar"
                                    type="file"
                                    accept="image/*"
                                    className="opacity-0 absolute w-full h-full top-0 left-0"
                                    onChange={handlePicture}
                                />
                                {error && (
                                    <p className="text-sm font-bold text-red-500 ml-2">
                                        {error}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {datePopUp && (
                    <button
                        type="button"
                        className="row h-12 text-gray-900 bg-white hover:bg-gray-300 hover:border-gray-300 shadow-md border font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                        onClick={handleNewDate}
                    >
                        <svg
                            className="w-5 h-5 rotate-90 mr-2"
                            aria-hidden="true"
                            fill="#FF0000"
                            viewBox="0 0 18 20"
                        >
                            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                        </svg>
                        <p className="text-sm font-bold">Send date</p>
                    </button>
                )}
            </div>
            {datePopUp && (
                <div className="absolute bottom-[134px] left-0 w-full sm:w-3/6 bg-gray-50 px-10 py-2 border-r border-y overflow-auto">
                    <p className="text-lg font-bold">Send new date</p>
                    <hr className="my-2"></hr>
                    <div className="mt-4">
                        <MultiplesInputOneRow nbInRow="2">
                            <ErrorField
                                name="latitude"
                                title="Latitude"
                                onBlur={handleOnChangeLatitude}
                                init={latitude}
                                disabled={isCheck}
                            />
                            <ErrorField
                                name="longitude"
                                title="Longitude"
                                onBlur={handleOnChangeLongitude}
                                init={longitude}
                                disabled={isCheck}
                            />
                        </MultiplesInputOneRow>
                        <div className="flex items-center mt-2">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                value={isCheck ? 'true' : 'false'}
                                onChange={() => handleCheck()}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label className="ms-2 text-sm font-medium text-gray-900">
                                Use my coordinates
                            </label>
                        </div>
                    </div>
                    <div className="mt-5">
                        <DateInputField
                            title="Date of the date"
                            onBlur={handleOnChangeDateRV}
                            min={getTodayDate()}
                            max={'2050-01-01'}
                            init={dateDate}
                        />
                    </div>
                    <div className="mt-6">
                        <label className="block text-sm font-medium leading-6 text-gray-900 mb-1">
                            Hour of the date
                        </label>
                        <input
                            onBlur={(e) => {
                                handleDateTime(e);
                            }}
                            onChange={(e) => handleDateTime(e)}
                            value={dateTime}
                            type="time"
                            className="block w-full rounded-md border-0 border-red-500 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-900 focus:ring-2 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-indigo-600 ring-gray-300"
                        />
                    </div>
                </div>
            )}
            {imageUpdate && (
                <div className="absolute bottom-[134px] left-0 w-full sm:w-5/12 max-h-80 bg-gray-50 p-2 border overflow-auto">
                    <img
                        className="w-full h-auto"
                        src={imageUpdate ? imageUpdate : ''}
                        alt="Displayed Image"
                    />
                </div>
            )}
        </form>
    );
}

export default ChatSendMessage;
