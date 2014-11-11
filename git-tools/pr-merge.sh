echo "Git status:"
git status -sb
echo "If that showed anything abort now (Ctrl + C)"
echo "Hit enter to continue (once you've read the message at the top and checked there was nothing uncommitted on the git status"
read x

echo "Please enter the PR number:"
read pr
echo ""

echo "Please enter the remote name for the repository the pr is against (e.g. public-phpbb, origin, upstream):"
read remote
echo ""

echo "We will now echo the fetch command, if think it looks okay, hit enter and it will run"
echo "$ git fetch $remote pull/$pr/head:pull-request-$pr"
read x
git fetch $remote pull/$pr/head:pull-request-$pr$

echo ""
echo "$ git checkout pull-request-$remote-$pr"
git checkout pull-request-$remote-$pr
echo ""

echo "You can now review the changes in your local branch, when you're done, hit enter"
echo "Make sure all commit messages have a ticket ID in them now and if they dont, fix them in a separate terminal window"
read x

echo "What branch would you like to merge into:"
read mergeInto

echo ""
echo "$ git checkout $mergeInto"
git checkout $mergeInto

echo ""
echo "$ git merge --no-ff pull-request-$pr"
git merge --no-ff pull-request-$pr

echo ""
echo "If there were any conflicts, please resolve them now in another terminal window. Hit enter to continue"
read x

echo "$ git push $remote $mergeInto"
git push $remote $mergeInto

echo "Git Status:"
git status -sb
echo ""
