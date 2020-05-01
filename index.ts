import Install from './src/install';
import Initialize from './src/initialize';

// インストール
const install = Install();

Initialize(install.ArtifactBucket);
