import menash, { ConsumerMessage } from 'menashmq';


require("dotenv").config();

module.exports = async () => {
    console.log("Trying connect to rabbit...");

    await menash.connect(process.env.RABBIT_URI);
    await menash.declareQueue('beforeMatch');
    await menash.declareQueue('afterMatch');

    console.log("Rabbit connected");

    await menash.queue('beforeMatch').activateConsumer(async (msg: ConsumerMessage) => {
        const {record, dataSource} = msg.getContent();

        const matchedRecord = basicMatch();

        await menash.send('afterMatch', { record: matchedRecord, dataSource});
    
        msg.ack();
    }, { noAck: false });
}
