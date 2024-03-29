const { Kafka } = require('kafkajs')

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
   clientId: 'to-do',
   //brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
   brokers: ["kafka:29094"],
   enforceRequestTimeout: false,
   ssl,
   sasl
})

module.exports = kafka
