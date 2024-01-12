import React, {useState} from 'react';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Profile from './pages/Profile';
import NavBar from './components/NavBar';
import AddMenu from './components/AddMenu';
import AddNewAccountModal from './components/AddNewAccountModal';
import UpdateAllModal from './components/UpdateAllModal';

function App() {
	const [selectedNavItem, setSelectedNavItem] = useState('home');
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
		console.log('Changd');
		setIsAddNewAccountModalOpen((prev) => !prev);
	};

	const renderContent = () => {
		switch (selectedNavItem) {
			case 'profile':
				return <Profile />;
			case 'accounts':
				return <Accounts />;
			default:
				return <Dashboard />;
		}
	};
	return (
		<>
			<main className="px-5 mt-20 overflow-y-hidden">{renderContent()}</main>
			{isMenuOpen && <AddMenu updateAllModal={toggleUpdateAllModal} addNewAccountModal={toggleAddNewAccountModal} />}
			{isUpdateAllModalOpen && <UpdateAllModal closeModal={toggleUpdateAllModal} />}
			{isAddNewAccountModalOpen && <AddNewAccountModal closeModal={toggleAddNewAccountModal} />}
			<NavBar onSelectNavItem={setSelectedNavItem} toggleMenu={toggleMenu} />
		</>
	);
}

export default App;
