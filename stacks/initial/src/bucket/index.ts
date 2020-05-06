import { Initial } from 'typings';
import Audio from './Audio';
import Frontend from './Frontend';
import Images from './Images';
import Artifacts from './Artifacts';

export default (): Initial.S3Outputs => ({
  Audio: Audio(),
  Frontend: Frontend(),
  Images: Images(),
  Artifacts: Artifacts(),
});
