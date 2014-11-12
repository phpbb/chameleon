set -ex

git fetch public-phpbb

git checkout phpbb/develop
git merge --ff public-phpbb/develop

git checkout phpbb/chameleon-core-changes
git merge --ff phpbb/develop

git push origin phpbb/develop phpbb/chameleon-core-changes
