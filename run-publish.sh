set -e
rm -rf build
sh run-test.sh

npm version patch --no-git-tag-version
npm publish