#!/bin/sh
#
# Push docs to GitHub
#
# Run:
#
# sh scripts/publish-docs.sh
#
# CSS issues: https://github.com/blog/572-bypassing-jekyll-on-github-pages
#

SOURCE=`pwd`

TARGET=/tmp/docs-dist

rm -rf $TARGET/gh-pages
install -d $TARGET/gh-pages

echo "Entering $TARGET"
cd $TARGET
# Need to have gh-pages initialized first http://help.github.com/pages/
git clone -b gh-pages git@github.com:miohtama/jquery-interdependencies.git gh-pages

cd gh-pages
# CSS issues: https://github.com/blog/572-bypassing-jekyll-on-github-pages
touch .nojekyll
# docs/ is on gitignore by default
cp -r $SOURCE .
rm .gitignore > /dev/null
git add -A
git commit -m "Updated gh-pages with new docs"
git push origin gh-pages

cd $SOURCE