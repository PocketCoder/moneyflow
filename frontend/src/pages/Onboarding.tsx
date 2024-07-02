import {useState} from 'react';
import {ProgressCircle, Button} from '@tremor/react';
import {Routes, Route, useLocation, useNavigate, redirect} from 'react-router-dom';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';

import Welcome from './onboarding/Welcome';
import Setup from './onboarding/Setup';
import NetWorth from './onboarding/NetWorth';
import Goal from './onboarding/Goal';
import Finish from './onboarding/Finish';

export default function Onbording() {
	const [netWorth, setNetWorth] = useState(0);
	const [goal, setGoal] = useState(0);
	const [accounts, setAccounts] = useState([
		{
			name: '',
			parent: '',
			type: '',
			balance: 0
		}
	]);

	const location = useLocation();
	const navigate = useNavigate();
	const steps = [
		'/onboarding/welcome',
		'/onboarding/setup',
		'/onboarding/networth',
		'/onboarding/goal',
		'/onboarding/finish'
	];
	const stepNames = ['Welcome', 'Getting set up', 'Calculate Net Worth', 'Setting a goal', 'Finished!'];
	const currentStep = steps.indexOf(location.pathname);
	const curr = currentStep + 1;
	const end = steps.length;

	function nextStep() {
		if (currentStep < steps.length - 1) {
			navigate(steps[currentStep + 1]);
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			navigate(steps[currentStep - 1]);
		}
	}

	function navigateAndRefresh() {
		const baseUrl = window.location.origin;
		const dashboardUrl = `${baseUrl}/dashboard`;
		window.location.href = dashboardUrl;
	}

	return (
		<main className="p-6 min-h-full h-full w-full mb-16">
			<div className="flex items-center justify-between w-full h-fit">
				<h1 className="text-2xl">Onboarding</h1>
				<div className="flex flex-row items-center ">
					<span className="mr-2 md:mr-6 font-bold">{stepNames[currentStep]}</span>
					<ProgressCircle value={(curr / end) * 100} size="md">
						<span>
							{curr} / {end}
						</span>
					</ProgressCircle>
				</div>
			</div>
			<Routes>
				<Route path="*" element={<Welcome />} />
				<Route path="welcome" element={<Welcome />} />
				<Route path="setup" element={<Setup accounts={accounts} setAccounts={setAccounts} setNW={setNetWorth} />} />
				<Route path="networth" element={<NetWorth accounts={accounts} nw={netWorth} />} />
				<Route path="goal" element={<Goal nw={netWorth} goal={goal} setGoal={setGoal} />} />
				<Route path="finish" element={<Finish accounts={accounts} goal={goal} netWorth={netWorth} />} />
			</Routes>
			<div className="fixed left-8 bottom-20 w-28 flex justify-between items-center">
				{currentStep < 1 ? (
					<Button className="p-2 bg-transparent border-none" disabled={true}>
						<ChevronLeftIcon className="h-6 text-black" />
					</Button>
				) : (
					<Button onClick={prevStep} className="p-2 bg-transparent border-none">
						<ChevronLeftIcon className="h-6 text-black hover:text-white" />
					</Button>
				)}
				{currentStep + 1 === end ? (
					<Button onClick={navigateAndRefresh}>Finish</Button>
				) : (
					<Button
						onClick={nextStep}
						className="p-2 bg-transparent border-none text-black hover:text-white"
						icon={ChevronRightIcon}
						iconPosition="right">
						{currentStep <= 0 ? 'Start' : 'Next'}
					</Button>
				)}
			</div>
		</main>
	);
}
