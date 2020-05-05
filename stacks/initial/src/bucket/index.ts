import { Initial } from 'typings';
import Audio from './Audio';
import Frontend from './Frontend';
import Images from './Images';

export default (): Initial.S3Outputs => ({
  Audio: Audio(),
  Frontend: Frontend(),
  Images: Images(),
});
