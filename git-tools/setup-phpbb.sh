set -ex
git remote add public-phpbb git@github.com:phpbb/phpbb.git
git fetch public-phpbb
git checkout -b phpbb/chameleon-core-changes origin/phpbb/chameleon-core-changes
git checkout -b phpbb/develop origin/phpbb/develop
