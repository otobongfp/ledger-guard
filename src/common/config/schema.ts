import convict from 'convict';

const schema = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  hostname: {
    doc: 'Public hostname where the service is running on',
    format: String,
    default: 'localhost',
    env: 'PUBLIC_HOSTNAME',
  },
  port: {
    doc: 'The port the application will run on',
    format: 'port',
    default: 3000,
    env: 'PORT',
  },
  seed: {
    doc: 'The seed phrase for LTO',
    format: String,
    default: '',
    env: 'SEED',
  },
  networkId: {
    doc: 'The network used currently',
    format: String,
    default: 'L',
    env: 'NETWORK_ID',
  },
  publicNodeUrl: {
    mainnet: {
      doc: 'The public node URL for the LTO network',
      format: 'url',
      default: 'https://nodes.lto.network',
      env: 'PUBLIC_NODE_URL_MAINNET',
    },
    testnet: {
      doc: 'The testnet public node URL for the LTO network',
      format: 'url',
      default: 'https://testnet.lto.network',
      env: 'PUBLIC_NODE_URL_TESTNET',
    },
  },
  rabbitmqUrl: {
    doc: 'The RabbitMQ connection URL',
    format: 'url',
    default: 'amqp://localhost',
    env: 'RABBITMQ_URL',
  },
});

export default schema;
