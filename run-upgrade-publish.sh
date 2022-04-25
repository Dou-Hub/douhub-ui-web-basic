set -e
sh run-upgrade.sh
sh run-tsc.sh

sh run-publish.sh