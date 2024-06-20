import {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {useQuery} from 'react-query';
import {Routes, Route} from 'react-router-dom';
import {Card, Button} from '@tremor/react';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {fetchUserData} from './lib/functions';
import {UserDataType} from './lib/definitions';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Profile from './pages/Profile';
import Callback from './pages/Callback';
import NotFound from './pages/NotFound';
import Loading from './pages/Loading';
import NavBar from './components/NavBar';
import AddMenu from './components/AddMenu';
import AddNewAccountModal from './components/AddNewAccountModal';
import UpdateAllModal from './components/UpdateAllModal';

import UserContext from './lib/UserContext';
import PrefContext from './lib/PrefContext';

export default function App() {
	const [preferences, setPreferences] = useState({year: new Date().getFullYear()});
	const [modalState, setModalState] = useState({
		isMenuOpen: false,
		isUpdateAllModalOpen: false,
		isAddNewAccountModalOpen: false
	});

	const [years, setYears] = useState<string[] | number[]>([]);

	const [userData, setUserData] = useState<UserDataType>({
		id: '',
		authID: '',
		email: '',
		accounts: [],
		netWorth: {},
		banks: [],
		prefs: {}
	});

	const {
		isLoading: authLoading,
		isAuthenticated,
		error: authError,
		user,
		getAccessTokenSilently,
		loginWithRedirect
	} = useAuth0();

	function authenticateUser() {
		if (!authLoading && !isAuthenticated) {
			loginWithRedirect({appState: {returnTo: '/dashboard'}});
		}
	}

	/*
	useEffect(() => {
		authenticateUser();
	}, [authLoading, isAuthenticated]);
	*/
	const {isLoading: queryLoading, error: queryError} = useQuery(
		'userData',
		() => fetchUserData(user, getAccessTokenSilently, loginWithRedirect),
		{
			enabled: isAuthenticated,
			onSuccess: (data) => {
				setUserData(data);
				setYears(data.years);
				toast.success('Data loaded!', {autoClose: 7000});
			},
			onError: (error) => {
				toast.error(`fetchData Error: ${error}`);
			}
		}
	);

	useEffect(() => {
		if (authError) toast.error(`Auth0 Error: ${authError}`);
		if (queryError) toast.error(`Query Error: ${queryError}`);
	}, [authError, queryError]);

	const toggleMenu = () => setModalState((prev) => ({...prev, isMenuOpen: !prev.isMenuOpen}));
	const toggleUpdateAllModal = () =>
		setModalState((prev) => ({...prev, isUpdateAllModalOpen: !prev.isUpdateAllModalOpen}));
	const toggleAddNewAccountModal = () =>
		setModalState((prev) => ({...prev, isAddNewAccountModalOpen: !prev.isAddNewAccountModalOpen}));

	console.log(userData);

	return (
		<PrefContext.Provider value={{preferences, setPreferences}}>
			<UserContext.Provider value={{userData, setUserData}}>
				{authLoading || queryLoading ? (
					<Loading />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/accounts" element={<Accounts />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/callback" element={<Callback />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				)}

				{modalState.isMenuOpen && (
					<AddMenu
						updateAllModal={toggleUpdateAllModal}
						addNewAccountModal={toggleAddNewAccountModal}
						toggleMenu={toggleMenu}
						menuState={modalState.isMenuOpen}
					/>
				)}
				{modalState.isUpdateAllModalOpen && (
					<UpdateAllModal isOpen={modalState.isUpdateAllModalOpen} toggle={toggleUpdateAllModal} />
				)}
				{modalState.isAddNewAccountModalOpen && <AddNewAccountModal closeModal={toggleAddNewAccountModal} />}
				<Card className="h-fit max-h-fit py-4 px-1 min-w-fit max-w-max fixed bottom-20 left-1/2 transform -translate-x-1/2 flex justify-evenly items-center">
					{!years.length ? (
						<Button size="xs" key={`no_years_button`} variant={'secondary'} className="mx-5">
							No data
						</Button>
					) : (
						years
							.sort((a, b) => b - a)
							.map((y, i) => (
								<Button
									size="xs"
									key={`${y}_${i}`}
									variant={preferences.year == y ? 'primary' : 'secondary'}
									className="mx-5"
									onClick={() => setPreferences({year: y})}>
									{y}
								</Button>
							))
					)}
				</Card>
				<NavBar toggleMenu={toggleMenu} />
				<ToastContainer />
			</UserContext.Provider>
		</PrefContext.Provider>
	);
}
