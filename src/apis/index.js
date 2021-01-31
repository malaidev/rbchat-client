import * as restAPIs from './rest';
import * as webSockets from './socket';

export default {...restAPIs, ...webSockets};