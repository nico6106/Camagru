import { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import Button from "./elems/Button";

function MobileMenuBoutton({
  showMenu,
  setShowMenu,
}: {
  showMenu: boolean;
  setShowMenu: any;
}) {
  return (
    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
      {/* <!-- Mobile menu button--> */}
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-controls="mobile-menu"
        aria-expanded="false"
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <span className="absolute -inset-0.5"></span>
        <span className="sr-only">Open main menu</span>

        <svg
          className="block h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>
  );
}

function MobileMenu({ showMenu }: { showMenu: boolean }) {
  return showMenu ? (
    <>
      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <ButtonLinkNavBar text="Dashboard" page="/dashboard" selected={true} block={true} />
          <ButtonLinkNavBar text="Team" page="/" selected={false} block={true} />
          <ButtonLinkNavBar text="Projects" page="/" selected={false} block={true} />
          <ButtonLinkNavBar text="Calendar" page="/" selected={false} block={true} />
        </div>
      </div>
    </>
  ) : null;
}
function ButtonLinkNavBar({
  text,
  page,
  selected,
  block,
}: {
  text: string;
  page: string;
  selected: boolean;
  block: boolean;
}) {
  let style: string = `text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium ${
    block && "block"
  }`;
  if (selected)
    style = `bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium ${
      block && "block"
    }`;
  return (
	<Link to={page}><p className={style} aria-current="page">{text}</p></Link>
    // <a href="#" className={style} aria-current="page">
      
    // </a>
  );
}

function LinkNavBar() {
  return (
    <div className="hidden sm:ml-6 sm:block">
      <div className="flex space-x-4">
        <ButtonLinkNavBar text="Dashboard" page="/dashboard" selected={true} block={false} />
        <ButtonLinkNavBar text="Team" page="" selected={false} block={false} />
        <ButtonLinkNavBar text="Projects" page="" selected={false} block={false} />
        <ButtonLinkNavBar text="Calendar" page="" selected={false} block={false} />
      </div>
    </div>
  );
}

function LogoNavBar() {
  return (
    <div className="flex flex-shrink-0 items-center">
      <img className="h-8 w-auto" src="./logo-matcha-red.png" alt="Matcha" />
    </div>
  );
}

function ButtonNotifications() {
  return (
    <button
      type="button"
      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    >
      <span className="absolute -inset-1.5"></span>
      <span className="sr-only">View notifications</span>
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    </button>
  );
}

function ButtonDropdownMenu({ text, page }: { text: string, page: string }) {
  return (
	<p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 "
	role="menuitem"
	id="user-menu-item-0"><Link to={page}>{text}</Link></p>
      
  );
}

function DropdownMenuLinks() {
  return (
    <div
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
      <ButtonDropdownMenu text="Your Profile" page="/dashboard" />
      <ButtonDropdownMenu text="Settings" page="/settings" />
      <ButtonDropdownMenu text="Sign out" page="/signout" />
    </div>
  );
}
function DropdownMenu() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [showDropMenu, setShowDropMenu] = useState<boolean>(false);

  return user ? (
    <div className="relative ml-3">
      <OutsideClickHandler
        onOutsideClick={() => {
          setShowDropMenu(false);
        }}
      >
        <div>
          <button
            type="button"
            className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={() => setShowDropMenu(!showDropMenu)}
          >
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </button>
        </div>

        {showDropMenu && <DropdownMenuLinks />}
      </OutsideClickHandler>
    </div>
  ) : (<Button
	text="Sign in"
	onClick={() => {
		navigate('/signin');
	}}
/>);
}

function NavBar() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  let outside: boolean = false;
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <OutsideClickHandler
            onOutsideClick={() => {
			  outside = true;
            }}
          >
            <MobileMenuBoutton
              showMenu={showMenu}
              setShowMenu={setShowMenu}
            />
          </OutsideClickHandler>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <LogoNavBar />
            <LinkNavBar />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ButtonNotifications />
            <DropdownMenu />
          </div>
        </div>
      </div>
      <OutsideClickHandler
        onOutsideClick={() => {
        //   console.log("outside small menu " + showMenu);
          if (outside) setShowMenu(false);
		  outside = false;
        }}
      >
        <MobileMenu showMenu={showMenu} />
      </OutsideClickHandler>
    </nav>
  );
}

export default NavBar;
