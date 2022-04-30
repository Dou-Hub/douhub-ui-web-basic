call yarn upgrade douhub-helper-util --latest
call yarn upgrade douhub-ui-store --latest
call copy "image.d.ts.copy" "node_modules/next/dist/client/image.d.ts" /Y
ECHO Upgrade Finished