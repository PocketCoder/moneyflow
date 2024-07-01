import {useState, useContext, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {toast} from 'react-toastify';
import {useMutation} from 'react-query';
import UserContext from '../../lib/UserContext';
import {TextInput, ProgressBar, Metric, Text, Subtitle, Button} from '@tremor/react';
import {TrophyIcon, DocumentPlusIcon} from '@heroicons/react/24/outline';

import {setNewGoal} from '../../lib/functions';

export default function Goal({nw, goal, setGoal}) {
    const {userData} = useContext(UserContext);
    const {getAccessTokenSilently} = useAuth0();
    const [error, setError] = useState(false);
    const [localGoal, setLocalGoal] = useState(goal);

    useEffect(() => {
        if (goal !== 0) {
            setGoal(nw * 2);
        } else {
			setGoal(nw + 1000);
		}
    }, [nw, goal, setGoal]);

    function parseInput(e) {
        if (parseFloat(e)) {
            setError(false);
            setLocalGoal(parseFloat(e));
        } else if (e === '') {
            setError(false);
        } else {
            setError(true);
        }
    }

    const saveGoalMutation = useMutation(
        async () => {
            const token = await getAccessTokenSilently();
            return setNewGoal(localGoal, token, userData);
        },
        {
            onMutate: () => {
                toast('Saving...');
            },
            onError: (error) => {
                toast.error(`Mutation Error: ${error}`);
            },
            onSuccess: () => {
                toast.success('Goal Updated');
                setGoal(localGoal);
            }
        }
    );

    function saveGoal() {
        saveGoalMutation.mutate();
    }

    return (
        <div className="w-full h-full">
            <h2 className="text-3xl mb-2">Goal</h2>
            <p>Add in a goal for this year.</p>
            <div className="mt-4">
                <div className="flex">
                    <TextInput
                        icon={TrophyIcon}
                        placeholder="Goal..."
                        value={localGoal}
                        onValueChange={(e) => parseInput(e)}
                        error={error}
                        errorMessage="Please enter a valid number..."
                        className="w-72 mr-4"
                    />
                    <Button icon={DocumentPlusIcon} iconPosition="left" onClick={saveGoal}>
                        Save
                    </Button>
                </div>
                <div className="flex items-center flex-wrap h-16 my-4">
                    <div className="w-fit h-full mr-4">
                        <Metric>£{nw}</Metric>
                        <Text>Current</Text>
                    </div>
                    <div className="w-3/5 h-full flex flex-col items-center justify-center">
                        <ProgressBar value={(nw / localGoal) * 100} className="" />
                        <Subtitle>{(nw / localGoal) * 100}%</Subtitle>
                    </div>
                    <div className="w-fit h-full ml-4">
                        <Metric>£{localGoal}</Metric>
                        <Text>Goal</Text>
                    </div>
                </div>
            </div>
        </div>
    );
}