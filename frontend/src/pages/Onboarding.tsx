import {ProgressCircle, Button} from '@tremor/react';
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';

import Welcome from './onboarding/Welcome';
import Setup from './onboarding/Setup';
import NetWorth from './onboarding/NetWorth';
import Goal from './onboarding/Goal';
import Finish from './onboarding/Finish';

export default function Onbording() {
	const location = useLocation();
	const navigate = useNavigate();
	const steps = [
		'/onboarding/welcome',
		'/onboarding/setup',
		'/onboarding/networth',
		'/onboarding/goal',
		'/onboarding/finish'
	];
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

	return (
		<main className="p-6 min-h-full h-full w-full mb-16">
			<div className="flex items-center justify-between w-full h-fit">
				<h1 className="text-2xl">Onboarding</h1>
				<ProgressCircle value={(curr / end) * 100} size="md">
					<span>
						{curr} / {end}
					</span>
				</ProgressCircle>
			</div>
			<Routes>
                <Route path="*" element={<Welcome nextStep={nextStep} prevStep={prevStep} />} />
				<Route path="welcome" element={<Welcome nextStep={nextStep} prevStep={prevStep} />} />
				<Route path="setup" element={<Setup nextStep={nextStep} prevStep={prevStep} />} />
				<Route path="networth" element={<NetWorth nextStep={nextStep} prevStep={prevStep} />} />
				<Route path="goal" element={<Goal nextStep={nextStep} prevStep={prevStep} />} />
				<Route path="finish" element={<Finish nextStep={nextStep} prevStep={prevStep} />} />
			</Routes>
			<div className="fixed left-8 bottom-20 w-28 flex justify-between items-center">
				{currentStep < 1 ? (
					<></>
				) : (
					<Button onClick={prevStep} className="p-2 bg-transparent border-none">
						<ChevronLeftIcon className="h-6 text-black" />
					</Button>
				)}
				{currentStep + 1 === end ? (
					<Button onClick={() => {navigate('/dashboard')}}>
                        Finish
                    </Button>
				) : (
					<Button onClick={nextStep} className="p-2 bg-transparent border-none">
						<ChevronRightIcon className="h-6 text-black" />
					</Button>
				)}
			</div>
		</main>
	);
}
