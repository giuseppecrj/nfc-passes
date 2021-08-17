const { NFC } = require('nfc-pcsc')
const nfc = new NFC();
const pretty = console

const KEY_TYPE_A = 0x60
const KEY_TYPE_B = 0x61


nfc.on('reader', (reader) => {
    console.log(`${reader.reader.name}  device attached`);
    // reader.aid = 'F222222222';


    reader.on('card', async card => {
        console.log(`${reader.reader.name} card detected`, card);

        try {
            await reader.authenticate(4, KEY_TYPE_A, 'ffffffffffff');
            pretty.info(`sector 1 successfully authenticated`, reader);
        } catch (err) {
            pretty.error(`error when authenticating block 4 within the sector 1`, reader, err);
            return;
        }

        try {
            const data = await reader.read(4, 16, 16);
            pretty.info(`data read`, data);
            const payload = data.readInt32BE(0);
            pretty.info(`data converted`, payload);
        } catch (err) {
            pretty.error(`error when reading data`, err);
        }

        // try {
        //     const data = Buffer.allocUnsafe(16);
        //     data.fill(0);
        //     const randomNumber = 0;
        //     data.writeInt32BE(randomNumber, 0);
        //     await reader.write(4, data, 16);
        //     pretty.info(`data written`, randomNumber, data);
        // } catch (err) {
        //     pretty.error(`error when writing data`, err);
        // }
    })

    // reader.on('card.off', card => {
    //     console.log(`${reader.reader.name}  card removed`, card);
    // });

    reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`);
    });
})

nfc.on('error', (err) => {
    console.log('an error ocurred', err)
})
