import PocketBase from 'pocketbase';
import fs from 'fs';

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090'); // Change URL if needed

// Load JSON file
const jsonData = JSON.parse(fs.readFileSync('cards.json', 'utf-8'));

// Ensure you are authenticated as admin (replace credentials)
async function authenticate() {
    await pb.admins.authWithPassword('filiph.wallsten@gmail.com', 'SolenVarBengt');
}

// Function to upload cards
async function uploadCards() {
    await authenticate();

    for (const pack of jsonData) {
        for (const whiteCard of pack.white) {
            await pb.collection('cards').create({
                text: whiteCard.text,
                type: 'white',
                pick: 0, // White cards always have pick 0
                pack: pack.name
            });
        }

        for (const blackCard of pack.black) {
            await pb.collection('cards').create({
                text: blackCard.text,
                type: 'black',
                pick: blackCard.pick, // Black cards have pick defined
                pack: pack.name
            });
        }
    }

    console.log('Cards imported successfully!');
}

// Run the upload function
uploadCards().catch(console.error);
