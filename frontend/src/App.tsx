import {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {useQuery} from 'react-query';
import {Routes, Route, Navigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import {setAuthToken} from './lib/api';
import {fetchUserData} from './lib/functions';
import {UserDataType} from './lib/definitions';

import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
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
import YearSelector from './components/YearSelector';

import UserContext from './lib/UserContext';
import PrefContext from './lib/PrefContext';

export default function App() {
	const [preferences, setPreferences] = useState({year: new Date().getFullYear()});
	const [modalState, setModalState] = useState({
		isMenuOpen: false,
		isUpdateAllModalOpen: false,
		isAddNewAccountModalOpen: false
	});

	const [isTokenSet, setIsTokenSet] = useState(false);

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
		async function fetchToken() {
			if (isAuthenticated) {
				const token = await getAccessTokenSilently();
				setAuthToken(token);
				setIsTokenSet(true);
			} else {
				authenticateUser();
			}
		}
		fetchToken();
	}, [isAuthenticated]);

	const {isLoading: queryLoading, error: queryError} = useQuery('userData', () => fetchUserData(user), {
		staleTime: 5 * 60 * 1000,
		cacheTime: 60 * 60 * 1000,
		enabled: isAuthenticated && isTokenSet,
		onSuccess: (data) => {
			setUserData(data);
			setYears(data.years);
			toast.success('Data loaded!', {autoClose: 7000});
		},
		onError: (error) => {
			toast.error(`fetchData Error: ${error}`);
		}
	});
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
	const newUser = userData.accounts.length === 0;

	return (
		<PrefContext.Provider value={{preferences, setPreferences}}>
			<UserContext.Provider value={{userData, setUserData}}>
				{authLoading || queryLoading ? (
					<Loading />
				) : (
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/onboarding/*" element={isAuthenticated ? <Onboarding /> : <Navigate to="/" />} />
						<Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
						<Route path="/accounts" element={isAuthenticated ? <Accounts /> : <Navigate to="/" />} />
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
				{modalState.isAddNewAccountModalOpen && (
					<AddNewAccountModal isOpen={modalState.isAddNewAccountModalOpen} toggle={toggleAddNewAccountModal} />
				)}
				{newUser ? <></> : <YearSelector years={years} preferences={preferences} setPreferences={setPreferences} />}
				<NavBar toggleMenu={toggleMenu} />
				<ToastContainer />
			</UserContext.Provider>
		</PrefContext.Provider>
	);
}
