import { Title, Text, Subtitle, Dialog, DialogPanel, Button } from '@tremor/react';

export default function InfoBox({isOpen, setIsOpen}) {
    return (
        <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
            <DialogPanel>
                <Title>Information</Title>
                <Text>Use this space to edit details about your accounts.</Text>
                <br />
                <Subtitle>Active / Inactive</Subtitle>
                <Text>Will show or hide accounts from the app.</Text>
                <br />
                <Subtitle>Touchable / Untouchable</Subtitle>
                <Text>Can you withdraw this money when you need to? Or is it locked away until a certain date or when certain conditions are met?</Text>
                <br />
                <Button variant='secondary' onClick={() => setIsOpen(false)} className='w-full'>Close</Button>
            </DialogPanel>
        </Dialog>
    )
}