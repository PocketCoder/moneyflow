import {useState, useEffect, ReactNode} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Routes, Route} from 'react-router-dom';
import {Callout, Card, Button} from '@tremor/react';
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {getAccountsAndBalances, getUniqueBanks, sumNetWorth} from './lib/functions';
import {getUserID} from './lib/data';
import {UserDataType} from './lib/definitions';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Profile from './pages/Profile';
import Callback from './pages/Callback';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';
import AddMenu from './components/AddMenu';
import AddNewAccountModal from './components/AddNewAccountModal';
import UpdateAllModal from './components/UpdateAllModal';
import UserContext from './lib/UserContext';
import PrefContext from './lib/PrefContext';

function App() {
	const currYear = new Date().getFullYear();

	const [displayErrors, setDisplayErrors] = useState<ReactNode[] | null>(null);

	function handleError(error, title: string) {
		const errorMessage = error instanceof Error ? error.message : error;
		const newError = (
			<Callout
				className="min-h-12 max-h-fit min-w-fit max-w-screen max-w-3/5 fixed bottom-20 left-2 z-50"
				title={title}
				icon={ExclamationTriangleIcon}
				color="rose">
				{errorMessage}
			</Callout>
		);
		setDisplayErrors((prev) => [...(prev || []), newError]);
	}

	const {isLoading, isAuthenticated, error, user, getAccessTokenSilently, loginWithRedirect} = useAuth0();

	const [userData, setUserData] = useState<UserDataType>({
		id: '',
		authID: '',
		email: '',
		accounts: [],
		netWorth: 0,
		banks: []
	});

	const [preferences, setPreferences] = useState({
		year: currYear
	});

	const [years, setYears] = useState([]);

	if (error) handleError(error, 'Auth0 Error');

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			loginWithRedirect({
				appState: {
					returnTo: '/dashboard'
				}
			});
		}

		async function fetchData(auth0id: string) {
			try {
				let token;
				try {
					token = await getAccessTokenSilently();
				} catch (e) {
					console.error(`Token Failed: ${e}`);
					await loginWithRedirect({
						appState: {
							returnTo: '/dashboard'
						}
					});
				}
				const {accountArr, allYears} = await getAccountsAndBalances(auth0id, token);
				setYears([...allYears]);
				const uniqueBanks = getUniqueBanks(accountArr);
				setUserData((prevObj) => ({
					...prevObj,
					banks: uniqueBanks,
					accounts: accountArr
				}));
				const nw = sumNetWorth(userData);
				setUserData((prevObj) => ({
					...prevObj,
					netWorth: nw
				}));
			} catch (error) {
				handleError(error, 'useEffect() Error');
			}
		}

		if (isAuthenticated) {
			if (user) {
				const auth0id = user ? user.sub?.split('|')[1] : '';
				const usrEmail = user.email ? user.email : '';
				setUserData((prevObj) => ({
					...prevObj,
					email: usrEmail || '',
					authID: auth0id || ''
				}));
				fetchData(auth0id);
			}
		}
	}, [isAuthenticated, user, getAccessTokenSilently]);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUpdateAllModalOpen, setIsUpdateAllModalOpen] = useState(false);
	const [isAddNewAccountModalOpen, setIsAddNewAccountModalOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const toggleUpdateAllModal = () => {
		setIsUpdateAllModalOpen((prev) => !prev);
	};

	const toggleAddNewAccountModal = () => {
		setIsAddNewAccountModalOpen((prev) => !prev);
	};

	console.log(userData);

	return (
		<PrefContext.Provider value={{preferences, setPreferences}}>
			<UserContext.Provider value={{userData, setUserData}}>
				<main className="px-5 overflow-y-hidden">
					{isLoading ? <span>Auth0 Loading...</span> : <></>}
					{displayErrors}
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/accounts" element={<Accounts />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/callback" element={<Callback />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				{isMenuOpen && (
					<AddMenu
						updateAllModal={toggleUpdateAllModal}
						addNewAccountModal={toggleAddNewAccountModal}
						toggleMenu={toggleMenu}
						menuState={isMenuOpen}
					/>
				)}
				{isUpdateAllModalOpen && (
					<UpdateAllModal usrData={userData} isOpen={isUpdateAllModalOpen} toggle={toggleUpdateAllModal} />
				)}
				{isAddNewAccountModalOpen && <AddNewAccountModal closeModal={toggleAddNewAccountModal} />}
				<Card className="h-fit max-h-fit py-4 px-1 min-w-fit max-w-max fixed bottom-20 left-1/2 transform -translate-x-1/2 flex justify-evenly items-center">
					{years.map((y, i) => (
						<Button
							size="xs"
							key={y}
							variant={preferences.year == y ? 'primary' : 'secondary'}
							className="mx-5"
							onClick={() => setPreferences({year: y})}>
							{y}
						</Button>
					))}
				</Card>
				<NavBar toggleMenu={toggleMenu} />
			</UserContext.Provider>
		</PrefContext.Provider>
	);
}

export default App;
