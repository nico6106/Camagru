import { useContext, useState } from 'react';
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
    const [isCheck, setIsCheck] = useState<boolean>(false);

    function handleSendMessage(event: any) {
        if (event) {
            event.preventDefault();
        }
        if (msg === '') return;
        const newMsg: DataSocketChatServ = {
            type: 'text',
            idChat: currChat,
            message: msg,
        };
        socket.emit('chat-serv', newMsg);
        setMsg('');
    }

    function handleDateTime(e: React.ChangeEvent<HTMLInputElement>) {
        setDateTime(e.target.value);
    }

    function handlePopUp() {
        setPopUp(!datePopUp);
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
        if (longitude === '' || latitude === '' || dateDate === '' || dateTime === '')
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
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {' '}
                            <path
                                d="M17 11C14.2386 11 12 13.2386 12 16C12 18.7614 14.2386 21 17 21C19.7614 21 22 18.7614 22 16C22 13.2386 19.7614 11 17 11ZM17 11V9M2 9V15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.0799 19 5.2 19H13M2 9V8.2C2 7.0799 2 6.51984 2.21799 6.09202C2.40973 5.71569 2.71569 5.40973 3.09202 5.21799C3.51984 5 4.0799 5 5.2 5H13.8C14.9201 5 15.4802 5 15.908 5.21799C16.2843 5.40973 16.5903 5.71569 16.782 6.09202C17 6.51984 17 7.0799 17 8.2V9M2 9H17M5 3V5M14 3V5M15 16H17M17 16H19M17 16V14M17 16V18"
                                stroke={!datePopUp ? '#FF0000' : '#000000'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>{' '}
                        </g>
                    </svg>
                    <p className="text-sm font-bold">
                        {!datePopUp ? 'Create a new date' : 'Cancel'}
                    </p>
                </button>
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
                <div className="absolute top-[104px] h-[395px] bg-gray-50 px-10 py-2 border-r border-b">
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
                            <label className="ms-2 text-sm font-medium text-gray-900">Use my coordinates</label>
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
        </form>
    );
}

export default ChatSendMessage;
