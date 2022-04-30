call run-tsc
call run-test
call npm version patch --no-git-tag-version
call npm publish

ECHO Publish Finished